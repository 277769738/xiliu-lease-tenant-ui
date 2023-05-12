<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search" />
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="用户帐号" prop="userCode">
            <el-input v-model="listQuery.userCode" placeholder="请输入用户帐号" clearable style="width: 240px" @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item label="用户姓名" prop="realName">
            <el-input v-model="listQuery.realName" placeholder="请输入用户姓名" clearable style="width: 240px" @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery()" size="small">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery()" size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button style="margin-left: 20px" type="primary" plain icon="el-icon-circle-plus" size="mini" @click="handleAdd" v-hasPermi="['system:user:create']">新增</el-button>
    </el-card>

    <div class="table-container">
      <el-table ref="adminTable" v-loading="listLoading" :data="list" style="width: 100%;" border>
        <el-table-column label="编号" width="100" align="center" type="index" />
        <el-table-column label="帐号" align="center">
          <template slot-scope="scope">{{ scope.row.userCode }}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{ scope.row.realName }}</template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">{{ scope.row.sex | setSexName }}</template>
        </el-table-column>
        <el-table-column label="部门" align="center">
          <template slot-scope="scope">{{ scope.row.dept != null ? scope.row.dept.deptName : "" }}</template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">{{ scope.row.userEmail }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">
            <span>{{ dateTimeFormat(scope.row.createdTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.$index,scope.row)"
              v-hasPermi="['system:user:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index,scope.row)"
              v-hasPermi="['system:user:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          layout="total, sizes,prev, pager, next,jumper"
          :current-page="listQuery.currentPage"
          :page-size="listQuery.pageSize"
          :page-sizes="[10,15,20]"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <el-dialog :title="isEdit?'编辑用户':'添加用户'" :visible.sync="dialogVisible" width="600px" :rules="rules">
        <el-form ref="userForm" :model="user" label-width="80px" size="small">
          <el-row>
            <el-col :span="12">
              <el-form-item v-if="user.userId == null" label="用户账号" prop="userCode">
                <el-input v-model="user.userCode" placeholder="请输入用户账号" maxlength="30" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="user.userId == null" label="用户密码" prop="passWord">
                <el-input v-model="user.passWord" placeholder="请输入用户密码" type="password" maxlength="20" show-password/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="realName">
                <el-input v-model="user.realName" placeholder="请输入姓名"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别">
                <el-select v-model="user.sex" placeholder="请选择性别">
                  <el-option label="男" :value="1" />
                  <el-option label="女" :value="2" />
                  <el-option label="未知" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="user.mobile" placeholder="请输入手机号码" maxlength="11" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="userEmail">
                <el-input v-model="user.userEmail" placeholder="请输入邮箱" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="归属部门" prop="deptId">
                <treeselect v-model="user.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属部门" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否启用">
                <el-radio-group v-model="user.status">
                  <el-radio :label="0">是</el-radio>
                  <el-radio :label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色">
                <el-select v-model="user.roleIds" multiple placeholder="请选择角色">
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                    :disabled="item.status == 1"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="handleDialogConfirm()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getUserList, updateUser, createUser, deleteUser,getUser } from '@/api/sys/user'
import { treeselect } from "@/api/sys/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: 'User',
  components: { Treeselect },
  filters: {
    setSexName(val) {
      let text = ''
      switch (val) {
        case 0:
          text = '未知'
          break
        case 1:
          text = '男'
          break
        case 2:
          text = '女'
          break
        default :
          text = ''
      }
      return text
    }
  },
  data() {
    return {
      user: {
        userId: null,
        userCode: null,
        passWord: null,
        realName: null,
        userEmail: null,
        status: 0,
        sex: null,
        age: null
      },
      listQuery: {
        currentPage: 1,
        pageSize: 10,
      },
      list: null,
      total: 0,
      listLoading: false,
      isEdit: false,
      dialogVisible: false,
      rules: {
        userCode: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          {
            min: 2,
            max: 140,
            message: '长度在 2 到 140 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 角色选项
      roleOptions: [],
      // 部门树选项
      deptOptions: undefined,
      // 表单重置
      reset() {
        this.user = {
          userId: null,
          status: 0,
          roleIds: []
        };
        this.resetForm("userForm");
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data
        this.total = response.pageInfo.totalCount
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.listQuery.pageNum = 1
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    handleAdd() {
      this.reset()
      this.getTreeselect();
      getUser().then(response => {
        this.roleOptions = response.data.roles;
        this.dialogVisible = true;
        this.title = "添加用户";
        this.isEdit = false
      });
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateUser(this.user.userId,this.user).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getUserList()
          })
        } else {
          createUser(this.user).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getUserList()
          })
        }
      })
    },
    handleUpdate(index, row) {
      this.getTreeselect();
      const userId = row.userId || this.ids;
      getUser(userId).then(response => {
        this.user = response.data.user;
        this.roleOptions = response.data.roles;
        this.user.roleIds = response.data.roleIds;
        this.dialogVisible = true
        this.isEdit = true
        this.title = "修改用户";
      });
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.userId).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUserList()
        })
      })
    },

  }
}
</script>
