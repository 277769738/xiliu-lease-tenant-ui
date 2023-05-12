<template>
  <div class="app-container">
    <!-- 查看对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" >
        <h3>度表费用设置</h3>
        <div class="boxarea">
          <div class="db_list" v-for="(db, index) in form.dbs" style="margin-top: 20px">
            <div class="el-input el-input-group" v-if="db.feeDbType && db.feeDbType.indexOf('df') >= 0">
              <div class="el-input-group__prepend">电费</div>
              <input type="text" class="el-input__inner" value="常规收费 ￥1.50元/度" disabled="disabled">
            </div>
            <div class="el-input el-input-group" v-if="db.feeDbType && db.feeDbType.indexOf('df') < 0">
              <div class="el-input-group__prepend">水费</div>
              <input type="text" class="el-input__inner" value="常规收费 ￥5.00元/吨" disabled="disabled">
            </div>
            <div class="db_list_table"></div>
          </div>
        </div>

        <h3>其他费用设置</h3>
        <div class="boxarea">
          <div class="qt_list" v-for="(qt, index) in form.qts" style="margin-top: 20px">
            <div class="el-input el-input-group">
              <div class="el-input-group__prepend">每月固定费用</div>
              <input class="el-input__inner qtfy_type_xm" :value="qt.qtTypeName" disabled="disabled">
              <input style="border-top: none;" :value="qt.feeAmount" disabled="disabled" class="el-input__inner">
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getHouseFeeInfo } from "@/api/house/room";

  export default {
    data() {
      return {
        open: false,
        title: '',
        form: {
          dbs: [{}],
          qts: [],
          index: null,
        },
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
          }
        })
      },
      cancel() {
        this.open = false;
      },
    }
  }
</script>
<style lang = "scss" scoped>
  .el-input-group__prepend {
    width: 160px;
    color: #0b9ada;
    text-align: center;
  }
</style>
