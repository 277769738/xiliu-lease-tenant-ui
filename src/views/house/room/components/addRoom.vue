<template>
  <div class="app-container">
    <div class="content navpan">
      <el-button  icon="el-icon-arrow-left" size="mini" @click="handleBack" style="float: left;margin-right:10px;">返回</el-button>
      <h2 style="font-size:20px;font-weight:normal;">{{ this.apartmentName }}<span style="color:#616161;font-size:15px;margin-left: 5px">[集中式]</span></h2>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="auto">
      <el-table :loading="loading" :data="form.roomList" :row-class-name="rowClassName" ref="tb" border >
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="楼层"  prop="floor">
          <template slot-scope="scope">
            <el-form-item :prop="'roomList[' + scope.$index + '].floor'" :rules="{ required: true, message: '请填写楼层', trigger: 'blur'}">
              <el-input v-model="form.roomList[scope.$index].floor" placeholder="" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="房间号" >
          <template slot-scope="scope">
            <el-form-item :prop="'roomList[' + scope.$index + '].houseNo'" :rules="{ required: true, message: '请填写房号', trigger: 'blur'}">
              <el-input v-model="form.roomList[scope.$index].houseNo" placeholder="" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="室"  prop="room">
          <template slot-scope="scope">
            <el-form-item :prop="'roomList[' + scope.$index + '].room'" :rules="{ required: true, message: '请填写几室', trigger: 'blur'}">
              <el-input v-model="form.roomList[scope.row.xh-1].room" placeholder="" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="厅"  prop="hall">
          <template slot-scope="scope">
            <el-form-item :prop="'roomList[' + scope.$index + '].hall'" :rules="{ required: true, message: '请填写几厅', trigger: 'blur'}">
              <el-input v-model="form.roomList[scope.$index].hall" placeholder="" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="卫"  prop="toilet">
          <template slot-scope="scope">
            <el-form-item :prop="'roomList[' + scope.$index + '].toilet'" :rules="{ required: true, message: '请填写几卫', trigger: 'blur'}">
              <el-input v-model="form.roomList[scope.$index].toilet" placeholder="" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="面积"  prop="area">
          <template slot-scope="scope">
            <el-form-item :prop="'roomList[' + scope.$index + '].area'" :rules="{ required: true, message: '请填写面积', trigger: 'blur'}">
              <el-input v-model="form.roomList[scope.$index].area" placeholder="" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="出租状态"  prop="state">
          <template slot-scope="scope">
            <el-form-item :prop="'roomList[' + scope.$index + '].state'" :rules="{ required: true, message: '请选择出租状态', trigger: 'blur'}">
              <el-select v-model="form.roomList[scope.$index].state">
                <el-option v-for="dict in dict.type.house_hire_status":key="dict.value":label="dict.label":value="dict.value"/>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="租金"  prop="money">
          <template slot-scope="scope">
            <el-form-item :prop="'roomList[' + scope.$index + '].money'" :rules="{ required: true, message: '请填写租金', trigger: 'blur'}">
              <el-input v-model="form.roomList[scope.$index].money" placeholder="" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="付款方式" width="180">
          <template slot-scope="scope">
            <el-form-item >
              <div class="el-input__inner" style="padding: 0">
                <el-select v-model="form.roomList[scope.$index].depositNum" style="width: 75px">
                  <el-option v-for="dict in dict.type.house_deposit_num":key="dict.value":label="dict.label":value="dict.value"/>
                </el-select>
                <el-select v-model="form.roomList[scope.$index].payNum" style="width: 75px;margin-left: 7px">
                  <el-option v-for="dict in dict.type.house_pay_num":key="dict.value":label="dict.label":value="dict.value"/>
                </el-select>
              </div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="押金"  prop="deposit">
          <template slot-scope="scope">
            <el-form-item :prop="'roomList[' + scope.$index + '].deposit'" :rules="{ required: true, message: '请填写押金', trigger: 'blur'}">
              <el-input v-model="form.roomList[scope.$index].deposit" placeholder="" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="其他费用"  align="center">
          <template slot-scope="scope">
            <el-form-item>
              <div v-if="form.roomList[scope.$index].fee" v-model="form.roomList[scope.$index].fee" style="font-size: 12px;color: green;height: 20px">
                已添加
              </div>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleAddOther(scope.$index,scope.row)">点击设置</el-button>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="物品配置" align="center">
          <template slot-scope="scope">
            <!--<el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">点击设置</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <div style="padding:10px;text-align:right;">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddDetails">添加一行</el-button>
      <el-button type="primary" icon="el-icon-circle-check" size="mini" @click="submitForm">保存</el-button>
    </div>

    <addOtherFee ref="addOtherFee" @confirmOtherFee="confirmOtherFee"></addOtherFee>
  </div>
</template>

<script>
  import addOtherFee from "./addOtherFee";
  import { getSimpleApartment } from "@/api/house/apartment";
  import { addRoom } from "@/api/house/room";

  export default {
    name: 'AddRoom',
    dicts: ['is_lift_type','apartment_type','house_hire_status','house_deposit_num','house_pay_num'],
    components: { addOtherFee},
    data() {
      return {
        loading: false,
        apartmentName: '',
        apartmentId: null,
        form:{
          roomList: [{
            state: '1',
            depositNum: '0',
            payNum: '1',
          }],
        },
        zdtsOptions: [],
        rules: {}
      }
    },
    created() {
      this.show();
    },
    methods: {
      // 显示弹框
      show() {
        const apartmentId = this.$route.params && this.$route.params.apartmentId;
        getSimpleApartment(apartmentId).then(response => {
          this.apartmentName = response.data.apartmentName;
          this.apartmentId = response.data.apartmentId;
        })
        this.loading = true;
      },
      handleBack() {
        // 关闭当前页签并返回到房源列表页签
        const obj = { path: "/house/room" };
        this.$tab.closeOpenPage(obj);
      },
      rowClassName({ row, rowIndex }) {
        row.xh = rowIndex + 1;
      },
      handleAddDetails() {
        if (this.form.roomList == undefined) {
          this.form.roomList = new Array();
        }
        let obj = {
          state: '1',
          depositNum: '0',
          payNum: '1',
        };
        this.form.roomList.push(obj);
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.roomList.splice(index, 1);
        });
      },
      handleAddOther(index, row) {
        this.$refs.addOtherFee.show(index,row);
      },
      confirmOtherFee(obj) {
        const fee = { dbs: obj.dbs, qts: obj.qts}
        this.form.roomList[obj.index].fee = fee
        this.$modal.msgSuccess("添加成功")
        // 强制更新table数据
        this.$set(this.form.roomList[obj.index])
      },
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.roomList.length > 0) {
              const obj = this.form.roomList
              for (let key in obj){
                if (!obj[key].fee) {
                  this.$modal.msgError("请添加其他费用")
                  return false;
                }
              }
            }
            addRoom({...this.form, apartmentId: this.apartmentId}).then(response => {
              this.$modal.msgSuccess("新增成功");
              const obj = { path: "/house/room" };
              this.$tab.closeOpenPage(obj);
            });
          }
        });
      },
      checkFee(val) {
        const obj = val
        for (let key in obj){
          if (!obj[key].fee) {
            return false;
          }
        }
        return true;
      },
    }
  }
</script>
<style lang = "scss" scoped>
  ::v-deep .el-form-item{
    margin-bottom: 0px;
  }
</style>
