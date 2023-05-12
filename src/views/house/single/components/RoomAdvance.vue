<template>
  <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body >
    <el-form ref="form" :model="form" :rules="rules">
      <el-row>
        <el-col :span="8">
          <el-form-item label="下定人" prop="realName" class="demo-input-suffix">
            <el-input v-model="form.realName" placeholder="请输入下定人姓名" style="width: 188px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话" prop="phoneNumber" class="demo-input-suffix">
            <el-input v-model="form.phoneNumber" placeholder="请输入联系电话" style="width: 188px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件类型" prop="idType" class="demo-input-suffix">
            <el-select v-model="form.idType" style="width: 188px">
              <el-option v-for="dict in dict.type.sys_id_type":key="dict.value":label="dict.label":value="dict.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件号码" prop="idNo" class="demo-input-suffix">
            <el-input v-model="form.idNo" placeholder="请输入证件号码" style="width: 188px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="下定日期" prop="downDate" class="demo-input-suffix">
            <el-date-picker clearable
                            v-model="form.downDate"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            placeholder="请选择日期" style="width: 188px">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="失效日期" prop="expireDate" class="demo-input-suffix">
            <el-date-picker clearable
                            v-model="form.expireDate"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            placeholder="请选择日期" style="width: 188px">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同起始" prop="contractStartDate" class="demo-input-suffix">
            <el-date-picker clearable
                            v-model="form.contractStartDate"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            placeholder="请选择日期" style="width: 188px">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同结束" prop="contractEndDate" class="demo-input-suffix">
            <el-date-picker clearable
                            v-model="form.contractEndDate"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            placeholder="请选择日期" style="width: 188px">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="约定租金" prop="monthMoney" class="demo-input-suffix">
            <el-input v-model="form.monthMoney" placeholder="请输入约定租金" style="width: 188px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="约定押金" prop="deposit" class="demo-input-suffix">
            <el-input v-model="form.deposit" placeholder="请输入约定押金" style="width: 188px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="下定金额" prop="frontMoney" class="demo-input-suffix">
            <el-input v-model="form.frontMoney" placeholder="请输入下定金额" style="width: 188px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入账时间" prop="fromDate" class="demo-input-suffix">
            <el-date-picker clearable
                            v-model="form.fromDate"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            placeholder="请选择日期" style="width: 188px">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收费方式" prop="feeType" class="demo-input-suffix">
            <el-select v-model="form.feeType" style="width: 188px">
              <el-option v-for="item in feeTypes" :key="item.value" :label="item.name" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注信息" prop="remarks">
            <el-input v-model="form.remarks" placeholder="请输入备注信息" style="width: 460px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitEditForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { saveAdvance } from "@/api/house/centralize"

  export default {
    dicts: ['sys_id_type'],
    data() {
      return {
        open: false,
        title: '',
        form: {
          houseId: null,
          monthMoney: null,
          deposit: null,
          downDate: this.getCurrentDate(),
          fromDate: this.getCurrentDate(),
        },
        feeTypes: [],
        rules: {
          realName: {required: true, message: '请填写下定人', trigger: 'blur'},
          phoneNumber: {required: true, message: '请填写联系电话', trigger: 'blur'},
          idType: {required: true, message: '请选择证件类型', trigger: 'blur'},
          idNo: {required: true, message: '请填写证件号码', trigger: 'blur'},
          downDate: {required: true, message: '请填写下定日期', trigger: 'blur'},
          expireDate: {required: true, message: '请填写失效日期', trigger: 'blur'},
          contractStartDate: {required: true, message: '请填写合同起始日期', trigger: 'blur'},
          contractEndDate: {required: true, message: '请填写合同结束日期', trigger: 'blur'},
          monthMoney: {required: true, message: '请填写约定租金', trigger: 'blur'},
          deposit: {required: true, message: '请填写约定押金', trigger: 'blur'},
          frontMoney: {required: true, message: '请填写下定金额', trigger: 'blur'},
          fromDate: {required: true, message: '请填写入账时间', trigger: 'blur'},
          feeType: {required: true, message: '请选择收费方式', trigger: 'blur'},
        }
      }
    },
    methods: {
      /** 打开 */
      show(val){
        this.open = true;
        this.title = '房间下定：' + val.houseNo;
        this.form.monthMoney = val.money;
        this.form.deposit = val.deposit;
        this.form.houseId = val.houseId;
        this.feeTypes = [
          {name: '现金', value:'1'},
          {name: '结清费用', value:'2'},
          {name: '银行卡转账支付', value:'3'}
        ]
      },
      getCurrentDate() {
        const date = new Date();
        return date;
      },
      /** 确认 */
      submitEditForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            saveAdvance(this.form).then(response => {
              this.$modal.msgSuccess("下定成功");
              this.open = false;
              this.$parent.getList();
            });
          }
        });
      },
      cancel() {
        this.open = false;
      }
    }
  }
</script>
<style lang = "scss" scoped>
  ::v-deep .el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    width: 90px;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
    font-weight:normal
  }
</style>
