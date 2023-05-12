<template>
  <el-dialog title="分配门店" :visible.sync="visible" width="600px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" class="frame">
      <el-form-item  prop="brandId">
        <el-select v-model="queryParams.brandId" placeholder="全部品牌">
          <el-option v-for="item in brands"
                     :key="item.brandId"
                     :label="item.brandName"
                     :value="item.brandId"/>
        </el-select>
      </el-form-item>
      <el-form-item  prop="projectId">
        <el-select v-model="queryParams.projectId" placeholder="全部项目">
          <el-option v-for="item in projects"
                     :key="item.classifyId"
                     :label="item.classifyName"
                     :value="item.classifyId"/>
        </el-select>
      </el-form-item>
      <el-form-item  prop="apartmentName">
        <el-input v-model="queryParams.apartmentName" class="input-width" placeholder="请输入公寓名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table @row-click="clickRow" ref="table" :data="dbTableList" @selection-change="handleSelectionChange" height="260px" border>
        <el-table-column type="selection" width="85"  align="center"></el-table-column>
        <el-table-column label="公寓名称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <b>
              {{ scope.row.apartmentName}}
            </b><br>
            {{ scope.row.address}}
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          layout="total, sizes,prev, pager, next,jumper"
          :current-page="queryParams.currentPage"
          :page-size="queryParams.pageSize"
          :page-sizes="[10,15,20]"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { listApartment,getAuthApartment, authApartment } from "@/api/services/staff";
  import { getUserProjectList } from "@/api/house/apartment";

  export default {
    data() {
      return {
        // 遮罩层
        visible: false,
        // 选中数组值
        tables: [],
        // 总条数
        total: 0,
        // 表数据
        dbTableList: [],
        table:{},
        brands: [],
        projects: [],
        userId: null,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          brandId: undefined,
          projectId: undefined,
          apartmentName: undefined
        }
      };
    },
    mounted () {

    },
    methods: {
      // 显示弹框
      show(userId) {
        this.userId = userId;
        this.getList();
        this.visible = true;
        // 获得项目列表
        getUserProjectList().then(response => {
          this.brands = response.data.brands;
          this.projects = response.data.projects;
        })
      },
      clickRow(row) {
        this.$refs.table.toggleRowSelection(row);
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.tables = selection.map(item => item.apartmentId);
      },
      // 查询表数据
      getList() {
        listApartment(this.queryParams).then(res => {
          if (res.code === 200) {
            this.dbTableList = res.rows;
            this.total = res.total;
            const authApartment = this.getAuthApartment();
            authApartment.then(res => {
              let checkedKeys = res;
              // 选中已分配的门店
              checkedKeys.forEach((v) => {
                this.dbTableList.forEach(row => {
                  if (row.apartmentId == v) {
                    this.$refs.table.toggleRowSelection(row, true);
                  }
                })
              })
            })
          }
        });
      },
      getAuthApartment() {
        return getAuthApartment(this.userId).then(response => {
          return response.data;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 保存 */
      submitForm() {
        const apartmentIds = this.tables.join(",");
        if (apartmentIds == "") {
          this.$message({type: 'warning',message: '请选择要分配的门店!'});
          return;
        }
        this.table.userId = this.userId;
        this.table.apartmentIds = apartmentIds;
        authApartment(this.table).then(res => {
          this.$message({type: 'success',message: res.message});
          if (res.code === 200) {
            this.visible = false;
            this.$emit("ok");
            this.$parent.getList();
          }
        });
      },
      handleSizeChange(val) {
        this.queryParams.pageNum = 1
        this.queryParams.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryParams.pageNum = val
        this.getList()
      },
    }
  };
</script>
<style lang = "scss" scoped>
  .frame {
    .el-form-item {
      .el-input {
        width: 170px;
      }
      .el-select {
        width: 135px;
      }
    }
  }
</style>
