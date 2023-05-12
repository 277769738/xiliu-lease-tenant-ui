<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="queryParams" ref="queryForm" size="small" label-width="140px">
          <el-form-item label="用户名称" prop="userCode">
            <el-input v-model="queryParams.userCode" placeholder="请输入用户名称" clearable style="width: 240px" @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="queryParams.mobile" placeholder="请输入手机号码" clearable style="width: 240px" @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery()" size="small">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery()" size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button style="margin-left: 20px" type="primary" plain icon="el-icon-circle-plus" size="mini" @click="openSelectUser" v-hasPermi="['system:role:create']">添加用户</el-button>
      <el-button type="danger" plain icon="el-icon-circle-close" size="mini" :disabled="multiple" @click="cancelAuthUserAll" v-hasPermi="['system:role:remove']">批量取消授权</el-button>
      <el-button type="warning" plain icon="el-icon-close" size="mini" @click="handleClose">关闭</el-button>
    </el-card>

    <div class="table-container">
      <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户名称" prop="userCode" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称" prop="realName" :show-overflow-tooltip="true" />
        <el-table-column label="邮箱" prop="userEmail" :show-overflow-tooltip="true" />
        <el-table-column label="手机" prop="mobile" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ dateTimeFormat(scope.row.createdTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-circle-close"
              @click="cancelAuthUser(scope.row)"
              v-hasPermi="['system:role:remove']"
            >取消授权</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination
        layout="total, sizes,prev, pager, next,jumper"
        :current-page="queryParams.currentPage"
        :page-size="queryParams.pageSize"
        :page-sizes="[5,10,15]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <select-user ref="select" :roleId="queryParams.roleId" @ok="handleQuery" />
  </div>
</template>

<script>
import { allocatedUserList, authUserCancel, authUserCancelAll } from "@/api/sys/role";
import selectUser from "./selectUser";

export default {
  name: "AuthUser",
  dicts: ['sys_normal_disable'],
  components: { selectUser },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中用户组
      userIds: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleId: undefined,
        userCode: undefined,
        mobile: undefined
      }
    };
  },
  created() {
    const roleId = this.$route.params && this.$route.params.roleId;
    if (roleId) {
      this.queryParams.roleId = roleId;
      this.getList();
    }
  },
  methods: {
    /** 查询授权用户列表 */
    getList() {
      this.loading = true;
      allocatedUserList(this.queryParams).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 返回按钮
    handleClose() {
      const obj = { path: "/system/role" };
      this.$tab.closeOpenPage(obj);
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
    // 返回按钮
    handleClose() {
      const obj = { path: "/sys/role" };
      this.$tab.closeOpenPage(obj);
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map(item => item.userId)
      this.multiple = !selection.length
    },
    /** 打开授权用户表弹窗 */
    openSelectUser() {
      this.$refs.select.show();
    },
    /** 取消授权按钮操作 */
    cancelAuthUser(row) {
      const roleId = this.queryParams.roleId;
      this.$modal.confirm('确认要取消该用户"' + row.userCode + '"角色吗？').then(function() {
        return authUserCancel({ userId: row.userId, roleId: roleId });
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("取消授权成功");
      }).catch(() => {});
    },
    /** 批量取消授权按钮操作 */
    cancelAuthUserAll(row) {
      const roleId = this.queryParams.roleId;
      const userIds = this.userIds.join(",");
      this.$modal.confirm('是否取消选中用户授权数据项？').then(function() {
        return authUserCancelAll({ roleId: roleId, userIds: userIds });
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("取消授权成功");
      }).catch(() => {});
    }
  }
};
</script>
