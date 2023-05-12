<template>
  <!-- 授权用户 -->
  <el-dialog title="选择用户" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userCode"
          placeholder="请输入用户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table @row-click="clickRow" ref="table" :data="userList" @selection-change="handleSelectionChange" height="260px" border>
        <el-table-column type="selection" width="55"></el-table-column>
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
      <el-button type="primary" @click="handleSelectUser">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { unallocatedUserList, authUserSelectAll } from "@/api/sys/role";
export default {
  dicts: ['sys_normal_disable'],
  props: {
    // 角色编号
    roleId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      userIds: [],
      // 总条数
      total: 0,
      // 未授权用户数据
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
  methods: {
    // 显示弹框
    show() {
      this.queryParams.roleId = this.roleId;
      this.getList();
      this.visible = true;
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
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
      this.userIds = selection.map(item => item.userId);
    },
    // 查询表数据
    getList() {
      unallocatedUserList(this.queryParams).then(res => {
        this.userList = res.rows;
        this.total = res.total;
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
    /** 选择授权用户操作 */
    handleSelectUser() {
      const roleId = this.queryParams.roleId;
      const userIds = this.userIds.join(",");
      if (userIds == "") {
        this.$modal.msgError("请选择要分配的用户");
        return;
      }
      authUserSelectAll({ roleId: roleId, userIds: userIds }).then(res => {
        this.$modal.msgSuccess(res.msg);
        if (res.code === 200) {
          this.visible = false;
          this.$emit("ok");
        }
      });
    }
  }
};
</script>
