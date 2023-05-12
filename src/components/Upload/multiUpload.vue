<template>
  <!---后端上传--> 
  <div>
    <el-upload
      :action="uploadUrl"
      :headers="headers"
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import { getToken } from '@/utils/auth'

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
        // 上传地址
        uploadUrl: process.env.VUE_APP_BASE_API + '/cos/upload/image',
        // 设置上传的请求头
        headers: { 'X-Token': getToken() },
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
        const isImage = file.type.indexOf("image/") != -1;
        const isLt2M = file.size / 1024 / 1024 < 10;

        if (!isImage) {
          this.$modal.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 10MB!");
        }
        return isImage && isLt2M;
      },
      // 上传成功后
      handleUploadSuccess(res, file) {
        console.log(res)
        let url = res.data;
        this.fileList.push({name: file.name,url:url});
        this.emitInput(this.fileList);
      },
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


