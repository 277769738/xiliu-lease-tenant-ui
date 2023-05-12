<template>
  <el-dialog title="添加紧急联系人" :visible.sync="open" width="400px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="紧急联系人" prop="urgentContact" style="width: 300px">
        <el-input placeholder="请输入紧急联系人" v-model="form.urgentContact" />
      </el-form-item>
      <el-form-item label="手机号码" prop="urgentContactNumber" style="width: 300px">
        <el-input placeholder="请输入手机号码" v-model="form.urgentContactNumber" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        open: false,
        form: {},
        rules:  {
          urgentContact: { required: true, message: '请输入紧急联系人', trigger: 'blur'},
          urgentContactNumber: { required: true, message: '请输入手机号码', trigger: 'blur'},
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
            this.$emit("confirmContact", this.form);
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
