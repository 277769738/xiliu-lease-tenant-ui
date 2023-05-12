<template>
  <div class="app-container">
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
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="用户名称" prop="userName">
              <el-input
                v-model="queryParams.userName"
                placeholder="请输入用户名称"
                clearable
                @keyup.enter.native="handleQuery"
              />
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
    </el-card>

    <!--数据列表区-->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="list.slice((pageNum-1)*pageSize,pageNum*pageSize)"
        style="width: 100%;"
        border
      >
      <el-table-column label="序号" type="index" align="center">
        <template slot-scope="scope">
          <span>{{(pageNum - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="会话编号" align="center" prop="tokenId" :show-overflow-tooltip="true" />
      <el-table-column label="登录名称" align="center" prop="userName" :show-overflow-tooltip="true" />
      <el-table-column label="部门名称" align="center" prop="deptName" />
      <el-table-column label="主机" align="center" prop="ipaddr" :show-overflow-tooltip="true" />
      <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
      <el-table-column label="浏览器" align="center" prop="browser" />
      <el-table-column label="操作系统" align="center" prop="os" />
      <el-table-column label="登录时间" align="center" prop="loginTime" width="180">
        <template slot-scope="scope">
          <span>{{ dateTimeFormat(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleForceLogout(scope.row)"
            v-hasPermi="['monitor:online:forceLogout']"
          >强退</el-button>
        </template>
      </el-table-column>
      </el-table>
    </div>

    <!--分页区-->
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
  </div>
</template>

<script>
  import { list, forceLogout } from "@/api/monitor/online";

  export default {
    name: "Online",
    data(){
      return {// 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 表格数据
        list: [],
        pageNum: 1,
        pageSize: 10,
        // 查询参数
        queryParams: {
          ipaddr: undefined,
          userName: undefined
        }}
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询登录日志列表 */
      getList() {
        this.loading = true;
        list(this.queryParams).then(response => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 强退按钮操作 */
      handleForceLogout(row) {
        this.$modal.confirm('是否确认强退名称为"' + row.userName + '"的用户？').then(function() {
          return forceLogout(row.tokenId);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("强退成功");
        }).catch(() => {});
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
  }
</script>
