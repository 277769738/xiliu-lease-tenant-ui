<template>
  <div style="margin-left: -10px; margin-right: -10px;">
    <el-row class="bor-l">
      <el-col :span="6" style="padding-left: 10px;padding-right: 10px;">
        <div class="div-font-style fangwu">
          <span>房屋信息</span>
        </div>
      </el-col>
    </el-row>
    <el-row class="fangwuxinxi">
      <el-col :span="6">
        <div>品牌 : 与之城市青年之家</div>
      </el-col>
      <el-col :span="6">
        <div>门店 : 南浦店</div>
      </el-col>
      <el-col :span="6">
        <div>楼栋 : 碧桂园</div>
      </el-col>
      <el-col :span="6">
        <div>房间号 : 101</div>
      </el-col>
      <el-col :span="6">
        <div>面积 : 12㎡</div>
      </el-col>
      <el-col :span="6">
        <div>定价 : 2000</div>
      </el-col>
      <el-col :span="6">
        <div>地址 : 111</div>
      </el-col>
    </el-row>
    <el-form ref="form" :model="value" :rules="rules">
      <el-row class="bor-l">
        <el-col :span="2" style="padding-left: 10px;padding-right: 10px; width: 10%">
          <div class="div-font-style">
            <span>租客信息</span>
          </div>
        </el-col>
        <el-col :span="8">
          <el-radio-group v-model="value.lessee.lesseeType">
            <el-radio :label="'gr'" >个人信息录入</el-radio>
            <!--<el-radio :label="'qy'">企业单位信息录入</el-radio>-->
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="承租人" prop="lessee.realName"  class="demo-input-suffix">
            <el-input placeholder="请输入内容" v-model="value.lessee.realName">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号码" prop="lessee.phoneNumber" class="demo-input-suffix">
            <el-input placeholder="请输入内容" v-model="value.lessee.phoneNumber">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件类型" prop="lessee.idType" class="demo-input-suffix">
            <el-select v-model="value.lessee.idType" style="width: 240px">
              <el-option v-for="dict in dict.type.sys_id_type":key="dict.value":label="dict.label":value="dict.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件号码" prop="lessee.idNo" class="demo-input-suffix">
            <el-input placeholder="请输入内容" v-model="value.lessee.idNo" style="width: 240px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="lessee.sex" class="demo-input-suffix">
            <el-select v-model="value.lessee.sex" placeholder="请选择性别" style="width: 240px">
              <el-option label="男" :value="'1'" />
              <el-option label="女" :value="'2'" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出生日期" prop="lessee.birthday" class="demo-input-suffix">
            <el-date-picker clearable
                            v-model="value.lessee.birthday"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            placeholder="请选择出生日期" style="width: 240px">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="民族" prop="lessee.nationName" class="demo-input-suffix">
            <el-select v-model="value.lessee.nationName" style="width: 240px">
              <el-option label="汉族" :value="'汉族'" />
              <el-option label="壮族" :value="'壮族'" />
              <el-option label="满族" :value="'满族'" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户类型" prop="lessee.punterType" class="demo-input-suffix">
            <el-select v-model="value.lessee.punterType" style="width: 240px">
              <el-option label="普通客户" :value="'pt'" />
              <el-option label="重要客户" :value="'zy'" />
              <el-option label="企业客户" :value="'qy'" />
              <el-option label="其他客户" :value="'qt'" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="来源渠道" prop="lessee.sourceType" class="demo-input-suffix">
            <el-select v-model="value.lessee.sourceType" style="width: 240px">
              <el-option label="上门客" :value="'smk'" />
              <el-option label="其他渠道" :value="'qtqd'" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item class="demo-input-suffix">
            <el-button :icon="isAddContact ? 'el-icon-success' : 'el-icon-circle-plus'" size="mini"
                       :style="isAddContact ? 'color:green':''" @click="showIdImg">添加证件照片</el-button>
            <el-button icon="el-icon-circle-plus" size="mini" @click="showCohabit">添加其他租客</el-button>
            <el-button :icon="isAddContact ? 'el-icon-success' : 'el-icon-circle-plus'"
                       :style="isAddContact ? 'color:green':''" size="mini" @click="showContact">
              添加紧急联系人
            </el-button>
          </el-form-item>
          <AddIdImg ref="addIdImg" @confirmImg="confirmImg"></AddIdImg>
          <AddCohabit ref="addCohabit" @confirmImg="confirmCohabit"></AddCohabit>
          <AddContact ref="addContact" @confirmContact="confirmContact"></AddContact>
        </el-col>
      </el-row>
      <el-row class="bor-l">
        <el-col :span="2" style="padding-left: 10px;padding-right: 10px;width: 10%">
          <div class="div-font-style">
            <span>租赁信息</span>
          </div>
        </el-col>
        <el-col :span="8">
          <el-radio-group v-model="value.contract.lesseeType">
            <el-radio :label="'cz'" >长租</el-radio>
            <!--<el-radio :label="'dz'">短租</el-radio>-->
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="起租日期" prop="contract.contractStartDate" class="demo-input-suffix">
            <el-date-picker clearable
                            v-model="value.contract.contractStartDate"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            placeholder="请选择起租日期" style="width: 240px">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束日期" prop="contract.contractEndDate" class="demo-input-suffix">
            <el-date-picker clearable
                            v-model="value.contract.contractEndDate"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            placeholder="请选择结束日期" style="width: 240px">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="付款方式" prop="contract.payType" class="demo-input-suffix">
            <el-select v-model="value.contract.payType" style="width: 240px">
              <el-option label="月付" :value="'1'" />
              <el-option label="两月付" :value="'2'" />
              <el-option label="季付" :value="'3'" />
              <el-option label="半年付" :value="'4'" />
              <el-option label="年付" :value="'5'" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="房屋租金" prop="contract.monthMoney" class="demo-input-suffix">
            <el-input placeholder="请输入房屋租金" v-model="value.contract.monthMoney" style="width: 240px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="押金方式" prop="contract.pledgeY" class="demo-input-suffix">
            <div class="el-input el-input-group">
              <div class="el-input-group__prepend">押</div>
              <el-select v-model="value.contract.pledgeY" style="width: 185px">
                <el-option v-for="dict in dict.type.house_deposit_num":key="dict.value":label="dict.label":value="dict.value"/>
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="房屋押金" prop="contract.deposit" class="demo-input-suffix">
            <el-input placeholder="请输入房屋押金" v-model="value.contract.deposit" style="width: 240px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计费方式" prop="contract.feeMethod" class="demo-input-suffix">
            <el-select v-model="value.contract.feeMethod" style="width: 240px">
                <el-option label="按自然月" :value="'1'" />
                <el-option label="按周期" :value="'2'" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="月收租日" prop="contract.feeDay" class="demo-input-suffix">
            <el-input placeholder="请输入每月收租日" v-model="value.contract.feeDay" class="input-with-select">
              <el-select v-model="value.contract.feeType" slot="append" placeholder="请选择" style="width: 80px">
                <el-option label="固定" :value="'1'"></el-option>
                <el-option label="提前" :value="'2'"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="滞纳金" prop="contract.lateFeePer" class="demo-input-suffix">
            <el-input placeholder="请输入内容" v-model="value.contract.lateFeePer">
              <span slot="append">%</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="超应收日" prop="contract.lateFeeDay" class="demo-input-suffix">
            <el-input placeholder="请输入超过应收日" v-model="value.contract.lateFeeDay">
              <span slot="append">开始计算</span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="bor-l">
        <el-col :span="2" style="padding-left: 10px;padding-right: 10px;width: 10%">
          <div class="div-font-style">
            <span>费用信息</span>
          </div>
        </el-col>
        <el-col :span="8">
          <el-button icon="el-icon-circle-plus" size="mini">能源</el-button>
          <el-button icon="el-icon-circle-plus" size="mini">押金</el-button>
          <el-button icon="el-icon-circle-plus" size="mini">费用</el-button>
        </el-col>
      </el-row>
      <el-row>

      </el-row>
      <el-row class="bor-l">
        <el-col :span="2" style="padding-left: 10px;padding-right: 10px;width: 10%">
          <div class="div-font-style">
            <span>其他信息</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-button icon="el-icon-circle-plus" size="mini">添加合同备注</el-button>
          <el-button icon="el-icon-circle-plus" size="mini">添加合同附件</el-button>
          <el-button icon="el-icon-circle-plus" size="mini">添加物品交割单</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item style="text-align: center;padding: 15px; border-top: 1px solid #eee;">
          <el-button size="medium" @click="handlePrev">保存并关闭</el-button>
          <el-button type="primary" size="medium" @click="handleFinishCommit">保存下一步</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import AddCohabit  from "./AddCohabit";
  import AddContact from "./AddContact";
  import AddIdImg from "./AddIdImg";
  export default {
    components: {
      AddContact,AddIdImg,AddCohabit
    },
    name: "HireInfo",
    dicts: ['house_type','house_select_num','house_hire_status','house_deposit_num','sys_id_type'],
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        isAddContact: false,
        isAddCohabit: false,
        isAddIdImg: false,
        rules: {
          'lessee.realName': [{required: true, message: '请输入承租人', trigger: 'blur'}],
          'lessee.phoneNumber': [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: "请输入正确的手机号码", trigger: "blur"}
          ],
          'lessee.idType': [{required: true, message: '请选择证件类型', trigger: 'blur'}],
          'lessee.idNo': [{required: true, message: '请填写证件号码', trigger: 'blur'}],
          'lessee.sex': [{required: true, message: '请选择性别', trigger: 'blur'}],
          'lessee.birthday': [{required: true, message: '请填写出生日期', trigger: 'blur'}],
          'lessee.nationName': [{required: true, message: '请选择民族', trigger: 'blur'}],
          'lessee.punterType': [{required: true, message: '请选择客户类型', trigger: 'blur'}],
          'lessee.sourceType': [{required: true, message: '请选择来源渠道', trigger: 'blur'}],
          'contract.contractStartDate': [{required: true, message: '请填写起租日期', trigger: 'blur'}],
          'contract.contractEndDate': [{required: true, message: '请填写结束日期', trigger: 'blur'}],
          'contract.payType': [{required: true, message: '请选择付款方式', trigger: 'blur'}],
          'contract.monthMoney': [{required: true, message: '请填写房屋租金', trigger: 'blur'}],
          'contract.pledgeY': [{required: true, message: '请选择押金方式', trigger: 'blur'}],
          'contract.deposit': [{required: true, message: '请填写房屋押金', trigger: 'blur'}],
          'contract.feeMethod': [{required: true, message: '请选择计费方式', trigger: 'blur'}],
          'contract.feeDay': [{required: true, message: '请填写收租日', trigger: 'blur'}],
          'contract.lateFeePer': [{required: true, message: '请填写滞纳金', trigger: 'blur'}],
          'contract.lateFeeDay': [{required: true, message: '请填写超过应收日', trigger: 'blur'}],
        }
      }
    },
    methods: {
      handleNext(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('next');
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      handlePrev(){
        this.$emit('prev')
      },
      handleFinishCommit(){
        this.$emit('finishCommit',this.isEdit);
      },
      /* 显示添加证件 */
      showIdImg() {
        this.$refs.addIdImg.show();
      },
      confirmImg(info) {
        this.value.lessee.idImgFront = info.idImgFront;
        this.value.lessee.idImgOpposite = info.idImgOpposite;
        if (info.urgentContact && info.urgentContactNumber) {
          this.isAddIdImg = true;
        } else {
          this.isAddIdImg = false;
        }
      },
      showCohabit() {
        this.$refs.addCohabit.show();
      },
      confirmCohabit(info) {

      },
      /* 显示添加联系人 */
      showContact() {
        this.$refs.addContact.show();
      },
      /* 确认添加联系人 */
      confirmContact(info) {
        this.value.lessee.urgentContact = info.urgentContact;
        this.value.lessee.urgentContactNumber = info.urgentContactNumber;
        if (info.urgentContact && info.urgentContactNumber) {
          this.isAddContact = true;
        } else {
          this.isAddContact = false;
        }
      },
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
