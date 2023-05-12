<template>
  <el-dialog title="添加承租人证件照片" :visible.sync="open" width="500px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="身份证正面" prop="idImgFront">
        <single-upload v-model="form.idImgFront"style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
      </el-form-item>
      <el-form-item label="身份证反面" prop="idImgOpposite">
        <single-upload v-model="form.idImgOpposite"style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import SingleUpload from '@/components/Upload/singleUpload';
  export default {
    components: { SingleUpload, },
    data() {
      return {
        open: false,
        form: {},
        rules:  {
        }
      }
    },
    methods: {
      /** 打开 */
      show(){
        this.open = true;
      },
      /** 确认 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.$emit("confirmImg", this.form);
            this.open = false;
          }
        });
      },
      cancel() {
        this.open = false;
      },
    }
  }
</script>
