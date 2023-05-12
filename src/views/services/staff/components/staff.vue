<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search" />
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="queryParams" ref="queryForm" size="small" label-width="68px">
          <el-form-item label="部门" prop="description">
            <el-select v-model="queryParams.description" placeholder="全部部门" @change="handleChangePost">
              <el-option v-for="item in descriptions"
                         :key="item"
                         :label="item"
                         :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="职务" prop="roleId">
            <el-select v-model="queryParams.roleId" placeholder="全部职务">
              <el-option v-for="item in roles"
                         :key="item.roleId"
                         :label="item.roleName"
                         :value="item.roleId"/>
            </el-select>
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
      <el-button style="margin-left: 20px" type="primary" plain icon="el-icon-circle-plus" size="mini" @click="handleAdd" v-hasPermi="['services:staff:create']">添加</el-button>
    </el-card>

    <div class="table-container">
      <el-table ref="adminTable" v-loading="loading" :data="staffList" style="width: 100%;" border>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{ scope.row.userCode }}</template>
        </el-table-column>
        <el-table-column label="部门" align="center">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="职务" align="center">
          <template slot-scope="scope">{{ scope.row.roleName }}</template>
        </el-table-column>
        <el-table-column label="门店分配" align="center">
          <template slot-scope="scope">
            <div :style="{ color: scope.row.isAuthProject ? 'green' : 'red' }">
              {{ scope.row.isAuthProject | setAuthText}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{ scope.row.realName }}</template>
        </el-table-column>
        <el-table-column label="手机" align="center">
          <template slot-scope="scope">{{ scope.row.mobile }}</template>
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
              @click="handleAuthProject(scope.row)"
              v-hasPermi="['services:staff:authProject']"
            >分配门店</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['services:staff:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['services:staff:remove']"
            >删除</el-button>
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

      <el-dialog :title="title" :visible.sync="dialogVisible" width="400px" class="avue-dialog">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-position="top" label-width="100px" class="frame">
          <el-form-item label="登录名" prop="userCode">
            <el-input v-model="form.userCode" placeholder="请输入11位手机号" maxlength="30" :disabled="this.updateOrAdd" />
          </el-form-item>
          <el-form-item label="登录密码" prop="passWord" :rules="this.updateOrAdd ? [{ required: false }] : rules.passWord">
            <template slot="label">
              <b class="label">登录密码</b>
              <span v-if="this.updateOrAdd" style="color: red;font-size: 12px">(留空表示不修改密码)</span>
            </template>
            <el-input v-model="form.passWord"  placeholder="请输入登录密码，最少6位" type="password" minlength="6"  maxlength="20" show-password/>
          </el-form-item>
          <el-form-item label="员工姓名" prop="realName">
            <el-input v-model="form.realName" placeholder="请输入姓名"/>
          </el-form-item>
          <el-form-item label="入职时间" prop="entryDate">
            <el-date-picker clearable
                            v-model="form.entryDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择入职时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="职务" prop="roleId">
            <el-select v-model="form.description" placeholder="全部部门" @change="handleChangePost">
              <el-option
                v-for="item in descriptions"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
            <el-select v-model="form.roleId" placeholder="请选择职务">
              <el-option
                v-for="item in roles"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="员工编号" prop="userNumber">
            <el-input v-model="form.userNumber" placeholder="请输入员工编号"/>
          </el-form-item>
          <el-form-item prop="idNo">
            <template slot="label">
              <b class="label">员工身份证号</b>
              <span style="color: red;font-size: 12px">(用于电子签约个人印章使用)</span>
            </template>
            <el-input v-model="form.idNo" placeholder="请输入身份证号"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="submitForm()">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <auth-project-table ref="authProject" />
  </div>
</template>
<script>
  import { listStaff, getStaff, delStaff, addStaff, updateStaff } from "@/api/services/staff";
  import { getPostList } from "@/api/services/post";
  import authProjectTable from "./authProjectTable";

  export default {
    components: { authProjectTable },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 部门
        descriptions: [],
        roles: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        dialogVisible: false,
        // 员工信息列表
        staffList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          description: null,
          roleName: null
        },
        // 是否更新 默认是插入 不禁用无法修改的字段
        updateOrAdd: false,
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          userCode: [
            { required: true, message: "登录名不能为空", trigger: "blur" }
          ],
          passWord: [
            { required: true, message: "登录密码不能为空", trigger: "blur" },
            { min: 6, message: "密码最少6位", trigger: "blur" }
          ],
          realName: [
            { required: true, message: "姓名不能为空", trigger: "blur" }
          ],
          roleId: [
            { required: true, message: "职务不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList()
      //获取职务
      this.getPostList()
    },
    filters: {
      setAuthText(val) {
        if (val) {
          return "已分配";
        } else {
          return "未分配";
        }
      }
    },
    methods: {
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
      handleSizeChange(val) {
        this.queryParams.pageNum = 1;
        this.queryParams.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.queryParams.pageNum = val;
        this.getList();
      },
      // 查询表数据
      getList() {
        listStaff(this.queryParams).then(res => {
          if (res.code === 200) {
            this.staffList = res.rows;
            this.total = res.total;
            this.loading = false;
          }
        });
      },
      // 获取职务信息
      getPostList() {
        getPostList().then(res => {
          if (res.code === 200) {
            this.descriptions = res.data.descriptions;
            this.roles = res.data.roles;
          }
        })
      },
      // 表单重置
      reset() {
        this.form = {
          userId: null,
        };
        this.resetForm("form");
      },
      handleAdd() {
        this.reset()
        this.dialogVisible = true;
        this.updateOrAdd = false;
        this.title = "添加员工";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.userId || this.ids
        getStaff(id).then(response => {
          this.form = response.data;
          this.dialogVisible = true;
          this.updateOrAdd = true;
          this.title = "修改员工";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.userId != null && this.updateOrAdd) {
              updateStaff(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.dialogVisible = false;
                this.getList();
              });
            } else {
              addStaff(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.dialogVisible = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.userId || this.ids;
        this.$modal.confirm('是否确认删除当前租户数据项？').then(function() {
          return delStaff(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      handleChangePost(val) {
        const newRoles = this.roles.filter(item => item.description == val);
        this.roles = newRoles;
      },
      /** 打开分配门店弹窗 */
      handleAuthProject(val) {
        this.$refs.authProject.show(val.userId);
      },
    }
  };
</script>
<style lang = "scss" scoped>
  .frame {
    .el-form-item {
      .el-input {
        width: 270px;
      }
      .el-select {
        width: 135px;
      }
    }
  }
</style>
