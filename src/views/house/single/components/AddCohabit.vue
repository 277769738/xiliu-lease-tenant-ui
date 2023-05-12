<template>
  <el-dialog title="添加其他住客" :visible.sync="open" width="900px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <div v-for="(cohabit, index) in form.cohabits">
        <el-row class="bor-l">
          <el-col :span="23" style="padding-left: 10px;padding-right: 10px;">
            <div class="div-font-style fangwu">
              <span>租客1</span>
            </div>
          </el-col>
          <span class="el-icon-delete select_style"></span>
        </el-row>
        <el-row >
          <el-col :span="8" style="padding-left: 10px;padding-right: 10px;">
            <el-form-item label="入住人姓名" :prop="'cohabit.' + index + '.realName'" >
              <el-input v-model="cohabit.realName" placeholder="请输入入住人姓名" style="width: 188px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px;padding-right: 10px;">
            <el-form-item label="联系电话" prop="phoneNumber" class="demo-input-suffix">
              <el-input v-model="form.phoneNumber" placeholder="请输入联系电话" style="width: 188px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px;padding-right: 10px;">
            <el-form-item label="性别" prop="lessee.sex" class="demo-input-suffix">
              <el-select v-model="form.sex" placeholder="请选择性别" style="width: 188px">
                <el-option label="男" :value="'1'" />
                <el-option label="女" :value="'2'" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px;padding-right: 10px;">
            <el-form-item label="与承租人关系" prop="lessee.sex" class="demo-input-suffix">
              <el-select v-model="form.sex" placeholder="请选择与承租人关系" style="width:188px">
                <el-option label="男" :value="'1'" />
                <el-option label="女" :value="'2'" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px;padding-right: 10px;">
            <el-form-item label="证件类型" prop="idType" class="demo-input-suffix">
              <el-select v-model="form.idType" style="width: 188px">
                <el-option v-for="dict in dict.type.sys_id_type":key="dict.value":label="dict.label":value="dict.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px;padding-right: 10px;">
            <el-form-item label="证件号码" prop="idNo" class="demo-input-suffix">
              <el-input v-model="form.idNo" placeholder="请输入证件号码" style="width: 188px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px;padding-right: 10px;">
            <el-form-item label="身份证正面照" prop="idImgFront">
              <single-upload v-model="form.idImgFront"style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px;padding-right: 10px;">
            <el-form-item label="身份证反面照" prop="idImgOpposite">
              <single-upload v-model="form.idImgOpposite"style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-button icon="el-icon-circle-plus" size="mini" @click="handleAddZk">添加租客</el-button>
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
    dicts: ['sys_id_type'],
    components: { SingleUpload, },
    data() {
      return {
        open: false,
        form: {
          cohabits: []
        },
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
      handleAddZk() {
        this.form.cohabits.push({});
      },
    }
  }
</script>
