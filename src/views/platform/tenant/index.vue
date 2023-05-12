<template>
  <div class="app-container">
    <!--搜索区-->
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="queryParams" size="small" label-width="140px">
          <el-form-item label="租户名称" prop="tenantName">
            <el-input v-model="queryParams.tenantName" class="input-width" placeholder="请输入租户名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="租户状态" prop="tenantStatus">
            <el-select v-model="queryParams.tenantStatus" placeholder="请选择租户状态" clearable>
              <el-option
                v-for="dict in dict.type.sys_tenant_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁结束时间" prop="dateRange">
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
    </el-card>

    <!--操作按钮区-->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button style="margin-left: 20px" type="primary" plain icon="el-icon-circle-plus" size="mini" @click="handleAdd" v-hasPermi="['platform:tenant:add']">新增</el-button>
      <el-button type="success" plain icon="el-icon-edit-outline" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['platform:tenant:edit']">修改</el-button>
      <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['platform:tenant:remove']">删除</el-button>
      <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['platform:tenant:export']">导出</el-button>
    </el-card>

    <!--数据列表区-->
    <div class="table-container">
      <el-table v-loading="loading" :data="tenantList" @selection-change="handleSelectionChange" border>
        <el-table-column prop="tenantLogo" label="logo" align="center" >
          <template slot-scope="scope">
            <img :src="scope.row.tenantLogo"/>
          </template>
        </el-table-column>
        <el-table-column label="租户名称" align="center" prop="tenantName" />
        <el-table-column label="类型" align="center" prop="tenantType" >
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_tenant_type" :value="scope.row.tenantType"/>
          </template>
        </el-table-column>
        <el-table-column label="管理员账号" align="center" prop="userName" />
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              active-value="0"
              inactive-value="1"
              v-model="scope.row.tenantStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="租户套餐" align="center" prop="packageId">
          <template slot-scope="scope">
            <el-tag>{{ getPackageName(scope.row.packageId)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="租赁结束时间" align="center">
          <template slot-scope="scope">
            <span>{{ dateTimeFormat(scope.row.tenantTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['platform:tenant:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['platform:tenant:remove']"
            >删除</el-button>
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

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="55%" class="avue-dialog" append-to-body v-dialogDrag >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="Logo" prop="logo">
              <single-avatar-upload v-model="form.tenantLogo"style="width: 300px;display: inline-block;margin-left: 10px"></single-avatar-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租户名称" prop="tenantName">
              <el-input v-model="form.tenantName" placeholder="请输入租户名称" :disabled="this.updateOrAdd"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="tenantType">
              <el-select v-model="form.tenantType" placeholder="请选择类型" clearable :disabled="this.updateOrAdd">
                <el-option
                  v-for="dict in dict.type.sys_tenant_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码" prop="tenantCode">
              <el-input v-model="form.tenantCode" placeholder="请输入租户编码" :disabled="this.updateOrAdd"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="官方网址" prop="homeUrl">
              <el-input v-model="form.homeUrl" placeholder="请输入官方网址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="tenantStatus">
              <el-radio-group v-model="form.tenantStatus">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sortOrder">
              <el-input-number v-model="form.sortOrder" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传真" prop="fax">
              <el-input v-model="form.fax" placeholder="请输入传真" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理员账号" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入管理员账号" :disabled="this.updateOrAdd"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理员密码" prop="userPwd">
              <el-input v-model="form.userPwd" placeholder="请输入管理员密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租户套餐" prop="packageId">
              <el-select v-model="form.packageId"  placeholder="请选择租户套餐" clearable size="small">
                <el-option v-for="item in packageList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租赁结束时间" prop="tenantTime">
              <el-date-picker clearable
                              v-model="form.tenantTime"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="请选择租赁结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="form.remarks" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="avue-dialog__footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import SingleAvatarUpload from '@/components/Upload/singleAvatarUpload';
  import { listTenant, getTenant, delTenant, addTenant, updateTenant } from "@/api/platform/tenant";
  import {getTenantPackageList} from "@/api/platform/tenantpackage";

  export default {
    name: "Tenant",
    dicts: ['sys_normal_disable','sys_tenant_type'],
    components: { SingleAvatarUpload },
    data() {
      return {
          dialogFull:false,
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
          // 租户管理表格数据
          tenantList: [],
          // 弹出层标题
          title: "",
          // 是否显示弹出层
          open: false,
          // 租户套餐列表
          packageList: [],
          // 时间范围
          dateRange: [],
          // 查询参数
          queryParams: {
            pageNum: 1,
            pageSize: 10,
            tenantName: null,
            userName: null,
            userPhone: null,
            tenantTime: null,
            status: null,
          },
          // 表单参数
          form: {},
          // 是否更新 默认是插入 不禁用无法修改的字段
          updateOrAdd: false,
          // 表单校验
          rules: {
            tenantCode: [
              { required: true, message: "租户编码不能为空", trigger: "blur" },
              {
                pattern: /^[1-9]\d*$/,
                message: "租户编码只能为数字类型",
                trigger: "blur"
              }
            ],
            tenantName: [
              { required: true, message: "租户名称不能为空", trigger: "blur" }
            ],
            tenantType: [
              { required: true, message: "租户类型不能为空", trigger: "blur" }
            ],
            userName: [
              { required: true, message: "管理员账号不能为空", trigger: "blur" }
            ],
            userPsw: [
              { required: true, message: "管理员密码不能为空", trigger: "blur" }
            ],
            phone: [
              { required: true, message: "手机号码不能为空", trigger: "blur" },
              {
                pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,
                message: "请输入正确的手机号码",
                trigger: "blur"
              }
            ],
            userEmail: [
              { required: true, message: "邮箱地址不能为空", trigger: "blur" },
              {
                type: "email",
                message: "请输入正确的邮箱地址",
                trigger: ["blur", "change"]
              }
            ],
            packageId: [
              { required: true, message: "租户套餐不能为空", trigger: "blur" }
            ],
            tenantTime: [
              { required: true, message: "租赁结束时间不能为空", trigger: "blur" }
            ],
            tenantStatus: [
              { required: true, message: "租户状态不能为空", trigger: "blur" }
            ],
          }
        };
    },
    created() {
      this.getList();
      // 获得租户套餐列表
      getTenantPackageList().then(response => {
        this.packageList = response.data;
      })
    },
    methods: {
      /** 查询租户管理列表 */
      getList() {
        this.loading = true;
        listTenant(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.tenantList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          tenantPackage: null,
          tenantTime: null,
          tenantStatus: '0',
        };
        this.resetForm("form");
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
        this.ids = selection.map(item => item.id)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.updateOrAdd=false;
        this.title = "新增租户";
        //每次修改租户的时候都会添加租户套餐校验
        getTenantPackageList().then(response => {
          this.packageList = response.data;
        })
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        getTenantPackageList().then(response => {
          this.packageList = response.data;
        })
        this.updateOrAdd=true;
        const id = row.tenantId || this.ids
        getTenant(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改租户";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.tenantId != null && this.updateOrAdd) {
              updateTenant(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addTenant(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.tenantId || this.ids;
        this.$modal.confirm('是否确认删除当前租户数据项？').then(function() {
          return delTenant(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/tenant/export', {
          ...this.queryParams
        }, `租户管理_${parseTime(new Date().getTime(), '{y}-{m}-{d}') }.xlsx`)
      } ,
      getPackageName(packageId) {
        var t_name = "";
        for (const t_item of this.packageList)
        {
          if (t_item.id === parseInt(packageId))
          {
            t_name = t_item.name;
          }
        }
        return t_name;
      }
    },
  }
</script>

<style lang="scss">

</style>
