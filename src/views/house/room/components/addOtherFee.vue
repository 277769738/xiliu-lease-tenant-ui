<template>
  <div class="app-container">
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules">
        <h3>度表费用设置
          <button  style="width:30px;height:30px;border-radius:15px;" type="button" class="el-button el-button--primary el-button--mini" @click="handleAddDb">
            <i class="el-icon-plus" style="margin-left: -6px"></i>
          </button>
        </h3>
        <div v-for="(db, index) in form.dbs">
          <div class="el-input el-input-group">
            <div class="el-input-group__prepend">
              <el-form-item :prop="'dbs.' + index + '.feeDbType'" :rules="rules.feeDbType" >
                <el-select v-model="db.feeDbType" placeholder="请选择度表" style="width: 200px" @change="handleChangeFee">
                  <el-option
                    v-for="dict in dict.type.db_fee_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </div>
            <el-form-item :prop="'dbs.' + index + '.feeCollectType'" :rules="rules.feeCollectType" >
              <el-select v-model="db.feeCollectType" placeholder="请先在左侧选择">
                <el-option v-if="db.feeDbType && db.feeDbType.indexOf('df') >= 0" v-for="item in dfFeeDetails"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value"/>
                <el-option v-if="db.feeDbType && db.feeDbType.indexOf('df') < 0" v-for="item in sfFeeDetails"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <div class="el-input-group__append del_me">
              <el-button slot="append" icon="el-icon-delete" @click="handleDelDb(db)"></el-button>
            </div>
          </div>
          <div style="padding-top: 10px" v-if="db.feeCollectType === '4'">
            <el-form-item :prop="'dbs.' + index + '.feeAmount'" :rules="rules.feeAmount">
              <input type="number" placeholder="请输入价格" v-model="db.feeAmount" autocomplete="off" class="el-input__inner val_number_price db_price">
            </el-form-item>
          </div>
        </div>

        <h3>其他费用设置
          <button style="width:30px;height:30px;border-radius:15px;" type="button" class="el-button el-button--primary el-button--mini" @click="handleAddQt">
            <i class="el-icon-plus" style="margin-left: -6px"></i>
          </button>
        </h3>
        <el-form-item v-for="(qt, index) in form.qts" :prop="'qts.' + index + '.feeAmount'" :rules="rules.feeAmount" style="margin-top: 20px">
          <div class="el-input el-input-group">
            <div class="el-input-group__prepend">
              <el-select v-model="qt.feeDbType" placeholder="请选择度表" style="width: 200px" @change="handleChangeFee">
                <el-option v-for="item in qtTypes"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value"/>
              </el-select>
            </div>
            <el-select v-model="qt.feeCollectType" placeholder="请选择费用" style="width: 200px" >
              <el-option
                v-for="dict in dict.type.qt_fee_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            <input type="number" style="border-top: none;" placeholder="请输入价格" v-model="qt.feeAmount" autocomplete="off" class="el-input__inner val_number_price qtfy_type_val">
            <div class="el-input-group__append del_me">
              <el-button slot="append" icon="el-icon-delete" @click="handleDelQt(qt)"></el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getHouseFeeInfo } from "@/api/house/room";

  export default {
    dicts: ['db_fee_type','qt_fee_type'],
    data() {
      return {
        open: false,
        title: '',
        form: {
          dbs: [{}],
          qts: [],
          index: null,
        },
        isEdit: false,
        dfFeeDetails:[],
        sfFeeDetails: [],
        qtTypes: [],
        qtFeeTypes: [],
        rules: {
          feeDbType: { required: true, message: '请选择度表', trigger: 'blur'},
          feeCollectType: { required: true, message: '请选择费用', trigger: 'blur'},
          feeAmount: { required: true, message: '请输入价格', trigger: 'blur'},
        }
      }
    },
    methods: {
      /** 打开设置 */
      show(index, row, houseId){
        this.open = true;
        this.title = row.houseNo ?  '房间号：'+ row.houseNo :  '房间号：未填写'
        this.form.index = index;
        if (houseId) {
          this.getInfo(houseId)
        }
      },
      getInfo(houseId) {
        getHouseFeeInfo(houseId).then(res => {
          if (res.code === 200) {
            this.form = res.data;
            this.isEdit = true;
          }
        })
      },
      /** 确认设置 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.dbs.length === 0) {
              this.$modal.msgError("请添加度表费用")
            } else {
              this.$emit("confirmOtherFee", this.form);
              this.open = false;
            }
          }
        });
      },
      cancel() {
        this.open = false;
      },
      handleAddDb() {
        this.form.dbs.push({});
      },
      handleDelDb(item) {
        var index = this.form.dbs.indexOf(item)
        if (index !== -1) {
          this.form.dbs.splice(index, 1)
        }
      },
      handleChangeFee(val) {
        this.feeDetails = [];
        if (val.indexOf('df') >= 0) {
          this.dfFeeDetails = [
            {name: '统一收费 0.00元/度', value:'1'},
            {name: '常规收费 1.50元/度', value:'2'},
            {name: '阶梯收费', value:'3'},
            {name: '自定义收费', value:'4'},
          ]
        } else {
          this.sfFeeDetails = [
            {name: '统一收费 0.00元/吨', value:'1'},
            {name: '常规收费 5.00元/吨', value:'2'},
            {name: '阶梯收费', value:'3'},
            {name: '自定义收费', value:'4'},
          ]
        }
      },
      initQt() {
        this.qtTypes = [
          {name: '每月固定费用', value:'1'},
          {name: '一次性费用', value:'2'}
        ];
        this.qtFeeTypes = [
          {name: '管理费', value:'1'},
          {name: '租金优惠', value:'2'},
          {name: '水电押金', value:'3'},
          {name: '租金退回', value:'4'},
          {name: '网费', value:'5'},
          {name: '卫生费', value:'6'},
          {name: '租金', value:'7'},
          {name: '门卡押金', value:'8'},
          {name: '公摊水电费', value:'9'},
          {name: '家具赔偿', value:'10'},
          {name: '水费费用', value:'11'},
          {name: '电费费用', value:'12'},
          {name: '小区门卡押金', value:'13'},
          {name: '家电', value:'14'},
          {name: '热水费', value:'15'},
          {name: '补房卡', value:'16'},
          {name: '换房服务费', value:'17'},
        ]
      },
      handleAddQt() {
        this.initQt();
        let obj = {
          feeDbType: '1',
          feeCollectType: '1'
        };
        this.form.qts.push(obj);
      },
      handleDelQt(item) {
        var index = this.form.qts.indexOf(item)
        if (index !== -1) {
          this.form.qts.splice(index, 1)
        }
      },
    }
  }
</script>
<style lang = "scss" scoped>
  ::v-deep .el-form-item {
    margin-bottom:0px;
  }
</style>
