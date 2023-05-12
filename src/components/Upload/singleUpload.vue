<template> 
  <div>
    <el-upload
      action=""
      list-type="picture"
      :multiple="false"
      :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :http-request="handleUploadFile"
      :on-preview="handlePreview"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import COS from 'cos-js-sdk-v5'
  import { getCosTempKey } from '@/api/upload'
  import { getFileNameUUID } from '@/utils/common'

  export default {
    name: 'singleUpload',
    props: {
      //图片
      value: String,
    },
    computed: {
      imageUrl() {
        return this.value;
      },
      imageName() {
        if (this.value != null && this.value !== '') {
          console.log(this.value)
          return this.value.substr(this.value.lastIndexOf("/") + 1);
        } else {
          return null;
        }
      },
      fileList() {
        return [{
          name: this.imageName,
          url: this.imageUrl
        }]
      },
      showFileList: {
        get: function () {
          return this.value !== null && this.value !== ''&& this.value!==undefined;
        },
        set: function (newValue) {
        }
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
        // 文件表单
        fileParams: {
          // 上传的文件目录
          folder: '/upload/house/'
        },
      };
    },
    methods: {
      emitInput(val) {
        this.$emit('input', val)
      },
      // 移除图片
      handleRemove(file, fileList) {
        this.emitInput('');
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
          Body: file.file
        },(err, data) => {
          if (data && data.statusCode === 200) {
            this.showFileList = true;
            this.fileList.pop();
            let uploadResult = `https://${data.Location}`
            that.$message({message: '上传成功', type: 'success'})
            this.fileList.push({name: file.name,url:uploadResult});
            this.emitInput(this.fileList[0].url);
          } else {
            that.$message.error("上传失败，请稍后重试！")
          }
        })
      },

    }
  }
</script>
<style>

</style>


