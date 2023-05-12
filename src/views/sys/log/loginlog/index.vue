<template>
  <div class="app-container">
      <!--搜索区-->
      <el-card class="filter-container" shadow="never">
          <div>
              <i class="el-icon-search"></i>
              <span>筛选搜索</span>
              <div style="margin-top: 15px">
                  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="140px">
                    <el-form-item label="登录地址" prop="ipaddr">
                      <el-input
                        v-model="queryParams.ipaddr"
                        placeholder="请输入登录地址"
                        clearable
                        style="width: 240px;"
                        @keyup.enter.native="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="登录时间">
                      <el-date-picker
                        v-model="dateRange"
                        style="width: 240px"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" icon="el-icon-search" @click="handleQuery()" size="small">搜索</el-button>
                      <el-button icon="el-icon-refresh" @click="resetQuery()" size="small">重置</el-button>
                    </el-form-item>
                  </el-form>
              </div>
          </div>
      </el-card>

      <!--操作按钮区-->
      <el-card class="operate-container" shadow="never">
          <i class="el-icon-tickets"></i>
          <span>数据列表</span>
          <el-button style="margin-left: 20px" type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:log:remove']">删除</el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleClean" v-hasPermi="['system:log:remove']">清空</el-button>
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:log:export']">导出</el-button>
      </el-card>

      <!--数据列表区-->
      <div class="table-container">
          <el-table v-loading="loading" :data="logList" @selection-change="handleSelectionChange" border>
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="访问编号" align="center" prop="loginId" />
              <el-table-column label="用户名称" align="center" prop="userCode" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']" />
              <el-table-column label="登录地址" align="center" prop="ipaddr" width="130" :show-overflow-tooltip="true" />
              <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
              <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
              <el-table-column label="操作系统" align="center" prop="os" />
              <el-table-column label="登录状态" align="center" prop="status" />
              <el-table-column label="操作信息" align="center" prop="msg" />
              <el-table-column label="登录日期" align="center" prop="loginTime" sortable="custom" :sort-orders="['descending', 'ascending']" width="180">
                <template slot-scope="scope">
                  <span>{{ dateTimeFormat(scope.row.loginTime) }}</span>
                </template>
              </el-table-column>

          </el-table>
      </div>

      <!--分页区-->
      <div class="pagination-container">
          <el-pagination
                  layout="total, sizes,prev, pager, next,jumper"
                  :current-page="queryParams.pageNum"
                  :page-size="queryParams.pageSize"
                  :page-sizes="[10,15,20]"
                  :total="total"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
          />
      </div>

    <!-- 添加或修改系统访问日志表对话框 -->

  </div>
</template>

<script>
import { listLog, delLoginlog, cleanLoginlog } from "@/api/sys/loginlog";

export default {
  name: "Loginlog",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 系统访问日志表表格数据
      logList: [],
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        currentPage: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询系统访问日志表列表 */
    getList() {
      this.loading = true;
      listLog(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.logList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        loginId: null,
        userCode: null,
        ipaddr: null,
        loginLocation: null,
        browser: null,
        os: null,
        msg: null,
        status: 0,
        loginTime: null,
        updatedTime: null,
        updatedBy: null,
        createdTime: null,
        createdBy: null,
        deleted: null,
        version: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.currentPage = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.loginId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const loginIds = row.loginId || this.ids;
      this.$modal.confirm('是否确认删除系统访问日志表编号为"' + loginIds + '"的数据项？').then(function() {
        return delLoginlog(loginIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 清空操作 **/
    handleClean() {
      this.$modal.confirm('是否确认清空所有登录日志数据项？').then(function () {
        return cleanLoginlog();
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("清空成功");
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/loginlog/export', {
        ...this.queryParams
      }, `log_${new Date().getTime()}.xlsx`)
    },
    handleSizeChange(val) {
        this.queryParams.pageNum = 1;
        this.queryParams.pageSize = val;
        this.getList();
    },
    handleCurrentChange(val) {
        this.queryParams.pageNum = val;
        this.getList();
    },
  }
};
</script>
