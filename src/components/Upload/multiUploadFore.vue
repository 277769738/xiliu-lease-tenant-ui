<template>
  <!---前端直传-->  
  <div>
    <el-upload
      action=""
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :http-request="handleUploadFile"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <!--进度条-->
    <el-progress v-show="showProgress"  :text-inside="true" :stroke-width="15"
       :percentage="progress" status="success"></el-progress>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import COS from 'cos-js-sdk-v5'
  import { getCosTempKey } from '@/api/upload'
  import { getFileNameUUID } from '@/utils/common'

  export default {
    name: 'multiUpload',
    props: {
      //图片属性数组
      value: Array,
      //最大上传图片数量
      maxCount:{
        type:Number,
        default:9
      }
    },
    data() {
      return {
        // 图片预览
        dialogVisible: false,
        // 图片预览地址
        dialogImageUrl:null,
        // COS
        cosData: {},
        // 进度条的显示
        showProgress: false,
        // 进度条数据
        progress: 0,
        // 文件表单
        fileParams: {
          // 上传的文件目录
          folder: '/upload/house/'
        },
      };
    },
    computed: {
      fileList() {
        let fileList=[];
        for(let i=0;i<this.value.length;i++){
          fileList.push({url:this.value[i]});
        }
        return fileList;
      }
    },
    methods: {
      emitInput(fileList) {
        let value=[];
        for(let i=0;i<fileList.length;i++){
          value.push(fileList[i].url);
        }
        this.$emit('input', value)
      },
      // 移除图片
      handleRemove(file, fileList) {
        this.emitInput(fileList);
      },
      // 预览图片
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl = file.url;
      },
      // 上传预处理
      beforeUpload(file) {
        return new Promise((resolve, reject) => {
          const isImage = file.type.indexOf("image/") != -1;
          const isLt2M = file.size / 1024 / 1024 < 10;

          if (!isImage) {
            this.$modal.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
            reject(false)
          }
          if (!isLt2M) {
            this.$message.error("上传头像图片大小不能超过 10MB!");
            reject(false)
          }
          // 获取cos临时密钥
          getCosTempKey().then(response => {
            this.cosData = response.data;
            resolve(true)
          }).catch(error => {
            this.$message.error('获取cos临时密钥失败！msg:' + error)
            reject(false)
          })
        })
      },
      // 前端直传文件
      handleUploadFile(file) {
        let that = this;
        // 获取COS实例
        const cos = new COS({
          // 必选参数
          getAuthorization: (options, callback) => {
            const obj = {
              TmpSecretId: that.cosData.credentials.tmpSecretId,
              TmpSecretKey: that.cosData.credentials.tmpSecretKey,
              XCosSecurityToken: that.cosData.credentials.sessionToken,
              // 时间戳，单位秒，如：1580000000
              StartTime: that.cosData.startTime,
              // 时间戳，单位秒，如：1580000900
              ExpiredTime: that.cosData.expiredTime
            }
            callback(obj)
          }
        });
        // 文件路径和文件名
        let cloudFilePath = this.fileParams.folder + getFileNameUUID() + '_' + file.file.name

        // 执行上传服务
        cos.putObject({
          // 你的存储桶名称
          Bucket: 'xiliu-1259663924',
          // 你的存储桶地址
          Region: 'ap-guangzhou',
          // key加上路径写法可以生成文件夹
          Key: cloudFilePath,
          StorageClass: 'STANDARD',
          // 上传文件对象
          Body: file.file,
          onProgress: progressData => {
            if (progressData) {
              console.log(progressData.percent)
              that.showProgress = true
              that.progress = Math.floor(progressData.percent * 100)
            }
          }
        },(err, data) => {
          if (data && data.statusCode === 200) {
            let uploadResult = `https://${data.Location}`
            that.showProgress = false
            that.$message({message: '上传成功', type: 'success'})
            this.fileList.push({name: file.name,url:uploadResult});
            this.emitInput(this.fileList);
          } else {
            that.$message.error("上传失败，请稍后重试！")
          }
        })
      },
      // 文件超出个数限制
      handleExceed(files, fileList) {
        this.$message({
          message: '最多只能上传'+this.maxCount+'张图片',
          type: 'warning',
          duration:1000
        });
      },
    }
  }
</script>
<style>

</style>


