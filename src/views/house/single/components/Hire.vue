<template>
    <el-drawer :visible.sync="dialog":with-header=false style="position: absolute"direction="rtl" :size="'80%'" >
      <div class="modal">
        <div class="modal-body">
          <el-row>
            <el-steps :active="active" process-status="finish" finish-status="success" simple>
              <el-step title="信息录入" />
              <el-step title="账单预览" />
              <el-step title="发起签约" />
            </el-steps>
          </el-row>

          <hire-info v-show="active == 0" v-model="hireInfo" @next="next"/>
        </div>
      </div>
    </el-drawer>
</template>
<script>
  import HireInfo from "./HireInfo"
  export default {
    components: {
      HireInfo
    },
    data() {
      return {
        dialog: false,
        active: 0,
        isEdit: false,
        hireInfo: {
          // 承租人信息
          lessee: {
            lesseeType: 'gr',
          },
          // 租约信息
          contract: {
            lesseeType: 'cz',
            feeType: '1',
            feeDay: 1,
            payType: '1',
            lateFeePer: 0,
            lateFeeDay: 0,
            feeMethod: '1',
            contractStartDate: this.getCurrentDate(),
          }
        }
      }
    },
    created(){
    },
    methods: {
      show(val){
        this.dialog = true;
        this.hireInfo.contract.monthMoney = val.money;
        this.hireInfo.contract.deposit = val.deposit;
      },
      getCurrentDate() {
        const date = new Date();
        return date;
      },
      prev() {
        if (this.active > 0 && this.active < 3) {
          this.active--;
        }
      },
      next() {
        if (this.active < 3) {
          this.active++;
        }
      },
      finishCommit() {
        this.$confirm('是否要提交该房源', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        })
      }
    }
  }
</script>
