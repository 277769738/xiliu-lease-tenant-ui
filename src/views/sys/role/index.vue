<template>
    <div class="app-container">
      <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="queryParams" ref="queryForm" size="small" label-width="140px">
            <el-form-item label="角色名称" prop="keyword">
              <el-input v-model="queryParams.keyword" class="input-width" placeholder="请输入角色名称" clearable></el-input>
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
        <el-button style="margin-left: 20px" type="primary" plain icon="el-icon-circle-plus" size="mini" @click="handleAdd" v-hasPermi="['system:role:create']">新增</el-button>
      </el-card>

      <div class="table-container">
        <el-table ref="roleTable"
                  :data="list"
                  style="width: 100%;"
                  v-loading="listLoading" border>
          <el-table-column label="编号" width="100" align="center">
            <template slot-scope="scope">{{scope.row.roleId}}</template>
          </el-table-column>
          <el-table-column label="角色名称" align="center">
            <template slot-scope="scope">{{scope.row.roleName}}</template>
          </el-table-column>
          <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true"/>
          <el-table-column label="描述" align="center">
            <template slot-scope="scope">{{scope.row.description}}</template>
          </el-table-column>
          <el-table-column label="添加时间" width="160" align="center">
            <template slot-scope="scope">
              <span>{{ dateTimeFormat(scope.row.createdTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否启用" width="140" align="center">
            <template slot-scope="scope">
              <el-switch
                @change="handleStatusChange(scope.$index, scope.row)"
                :active-value="0"
                :inactive-value="1"
                v-model="scope.row.status">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleAuthMenu(scope.row)"
                  v-hasPermi="['system:role:auth']"
                >分配菜单</el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:role:edit']"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:role:remove']"
                >删除</el-button>
              <el-dropdown size="mini" @command="handleCommand" v-hasPermi="['system:role:edit']">
                <span class="el-dropdown-link">
                  <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="beforeHandleCommand('handleDataScope', scope.row)" icon="el-icon-circle-check"
                                    v-hasPermi="['system:role:edit']">数据权限</el-dropdown-item>
                  <el-dropdown-item :command="beforeHandleCommand('handleAuthUser', scope.row)" icon="el-icon-user"
                                    v-hasPermi="['system:role:edit']">分配用户</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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

      <el-dialog :title="isEdit?'编辑角色':'添加角色'" :visible.sync="dialogVisible" width="40%">
        <el-form :model="form" ref="roleForm" :rules="rules" label-width="150px" size="small">
          <el-form-item label="角色名称：" prop="roleName">
            <el-input v-model="form.roleName" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item prop="roleKey">
          <span slot="label">
            <el-tooltip content="自定义权限控制器" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            权限字符
          </span>
            <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
          </el-form-item>
          <el-form-item label="是否启用：">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
            <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
            <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
            <el-tree
              class="tree-border"
              :data="menuOptions"
              show-checkbox
              ref="menu"
              node-key="id"
              :check-strictly="!form.menuCheckStrictly"
              empty-text="加载中，请稍候"
              :props="defaultProps"
            ></el-tree>
          </el-form-item>
          <el-form-item label="描述：">
            <el-input v-model="form.description"
                      type="textarea"
                      :rows="5"
                      style="width: 250px"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
      </el-dialog>

      <!-- 分配菜单权限配置对话框 -->
      <el-dialog :title="title" :visible.sync="openAuthMenu" width="500px" append-to-body>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="菜单权限">
            <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
            <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
            <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
            <el-tree
              class="tree-border"
              :data="menuOptions"
              show-checkbox
              ref="menu"
              node-key="id"
              :check-strictly="!form.menuCheckStrictly"
              empty-text="加载中，请稍候"
              :props="defaultProps"
            ></el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitFormAuthMenu">确 定</el-button>
          <el-button @click="openAuthMenu = false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 分配角色数据权限对话框 -->
      <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
        <el-form :model="form" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="form.roleName" :disabled="true" />
          </el-form-item>
          <el-form-item label="权限字符">
            <el-input v-model="form.roleKey" :disabled="true" />
          </el-form-item>
          <el-form-item label="权限范围">
            <el-select v-model="form.dataScope" @change="dataScopeSelectChange(form.dataScope)">
              <el-option
                v-for="item in dataScopeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据权限" v-show="form.dataScope == 2">
            <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
            <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
            <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
            <el-tree
              class="tree-border"
              :data="deptOptions"
              show-checkbox
              default-expand-all
              ref="dept"
              node-key="id"
              :check-strictly="!form.deptCheckStrictly"
              empty-text="加载中，请稍候"
              :props="defaultProps"
            ></el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDataScope()">确 定</el-button>
          <el-button @click="cancelDataScope()">取 消</el-button>
        </div>
      </el-dialog>

    </div>
</template>
<script>
  import {fetchList,createRole,updateRole,updateStatus,deleteRole,authRoleMenu,deptTreeSelect,getRole,dataScope} from '@/api/sys/role';
  import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/sys/menu";

  export default {
    name: 'roleList',
    data() {
      return {
        queryParams: {
          pageNum: 1,
          pageSize: 5,
          keyword: null,
        },
        list: null,
        total: 0,
        listLoading: false,
        isEdit: false,
        dialogVisible: false,
        // 弹出层标题
        title: "",
        // 是否显示弹出层（菜单权限）
        openAuthMenu: false,
        // 是否显示弹出层（数据权限）
        openDataScope: false,
        menuExpand: false,
        menuNodeAll: false,
        deptExpand: true,
        deptNodeAll: false,
        // 数据范围选项
        dataScopeOptions: [
          {
            value: "1",
            label: "全部数据权限"
          },
          {
            value: "2",
            label: "自定数据权限"
          },
          {
            value: "3",
            label: "本部门数据权限"
          },
          {
            value: "4",
            label: "本部门及以下数据权限"
          },
          {
            value: "5",
            label: "仅本人数据权限"
          }
        ],
        // 菜单列表
        menuOptions: [],
        // 部门列表
        deptOptions: [],
        // 表单参数
        form: {},
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 表单校验
        rules: {
          roleName: [
            { required: true, message: "角色名称不能为空", trigger: "blur" }
          ],
          roleKey: [
            { required: true, message: "权限字符不能为空", trigger: "blur" }
          ]
        }
      }
    },
    created() {
      this.getList()
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
      handleAdd() {
        this.dialogVisible = true;
        this.reset();
        this.getMenuTreeselect();
        this.isEdit = false;
      },
      getList() {
        this.listLoading = true;
        fetchList(this.queryParams).then(response => {
          this.listLoading = false;
          this.list = response.data;
          this.total = response.pageInfo.totalCount;
        });
      },
      handleStatusChange(index, row) {
        this.$confirm('是否要修改该状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatus(row.roleId, {status: row.status}).then(response => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });
          this.getList();
        });
      },
      handleDelete(row) {
        this.$confirm('是否要删除该角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = row.roleId || this.ids;
          deleteRole(ids).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },
      handleUpdate(row) {
        this.reset();
        const roleId = row.roleId || this.ids
        const roleMenu = this.getRoleMenuTreeselect(roleId);
        getRole(roleId).then(response => {
          this.form = response.data;
          this.dialogVisible = true;
          this.isEdit = true;
          this.$nextTick(() => {
            roleMenu.then(res => {
              let checkedKeys = res.data.checkedKeys
              checkedKeys.forEach((v) => {
                this.$nextTick(()=>{
                  this.$refs.menu.setChecked(v, true ,false);
                })
              })
            });
          });
          this.title = "修改角色";
        });
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            updateRole(this.form.roleId,this.form).then(response => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            createRole(this.form).then(response => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          }
        })
      },
      /** 查询菜单树结构 */
      getMenuTreeselect() {
        menuTreeselect().then(response => {
          this.menuOptions = response.data;
        });
      },
      // 所有菜单节点数据
      getMenuAllCheckedKeys() {
        // 目前被选中的菜单节点
        let checkedKeys = this.$refs.menu.getCheckedKeys();
        // 半选中的菜单节点
        let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
        checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
        return checkedKeys;
      },
      /** 根据角色ID查询菜单树结构 */
      getRoleMenuTreeselect(roleId) {
        return roleMenuTreeselect(roleId).then(response => {
          this.menuOptions = response.data.menus;
          return response;
        });
      },
      /** 分配菜单权限操作 */
      handleAuthMenu(row) {
        this.reset();
        const roleMenu = this.getRoleMenuTreeselect(row.roleId);
        this.openAuthMenu = true;
        this.form.roleId = row.roleId;
        roleMenu.then(res => {
          let checkedKeys = res.data.checkedKeys
          checkedKeys.forEach((v) => {
            this.$nextTick(()=>{
              this.$refs.menu.setChecked(v, true ,false);
            })
          })
        });
        this.title = "分配菜单权限";
      },
      // 表单重置
      reset() {
        if (this.$refs.menu != undefined) {
          this.$refs.menu.setCheckedKeys([]);
        }
        this.menuExpand = false,
        this.menuNodeAll = false,
        this.deptExpand = true,
        this.deptNodeAll = false,
        this.form = {
          roleId: undefined,
          status: 0,
          menuIds: [],
          deptIds: [],
          menuCheckStrictly: true,
          deptCheckStrictly: true,
        };
        this.resetForm("form");
      },
      /** 分配菜单提交按钮 */
      submitFormAuthMenu: function() {
        if (this.form.roleId != undefined) {
          this.form.menuIds = this.getMenuAllCheckedKeys();
          authRoleMenu(this.form).then(response => {
            this.$message({
              message: '分配成功！',
              type: 'success'
            });
            this.openAuthMenu = false;
            this.getList();
          });
        }
      },
      // 树权限（展开/折叠）
      handleCheckedTreeExpand(value, type) {
        if (type == 'menu') {
          let treeList = this.menuOptions;
          for (let i = 0; i < treeList.length; i++) {
            this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
          }
        } else if (type == 'dept') {
          let treeList = this.deptOptions;
          for (let i = 0; i < treeList.length; i++) {
            this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
          }
        }
      },
      // 树权限（全选/全不选）
      handleCheckedTreeNodeAll(value, type) {
        if (type == 'menu') {
          this.$refs.menu.setCheckedNodes(value ? this.menuOptions: []);
        } else if (type == 'dept') {
          this.$refs.dept.setCheckedNodes(value ? this.deptOptions: []);
        }
      },
      // 树权限（父子联动）
      handleCheckedTreeConnect(value, type) {
        if (type == 'menu') {
          this.form.menuCheckStrictly = value ? true: false;
        } else if (type == 'dept') {
          this.form.deptCheckStrictly = value ? true: false;
        }
      },

      beforeHandleCommand(methodName, value) {
        return {
          methodName: methodName,
          value: value,
        };
      },
      // 更多操作触发
      handleCommand(command) {
        if (command.methodName === "handleDataScope") {
          this.handleDataScope(command.value);
        } else if (command.methodName === "handleAuthUser") {
          this.handleAuthUser(command.value);
        }
      },
      /** 根据角色ID查询部门树结构 */
      getDeptTree(roleId) {
        return deptTreeSelect(roleId).then(response => {
          this.deptOptions = response.depts;
          return response;
        });
      },
      /** 选择角色权限范围触发 */
      dataScopeSelectChange(value) {
        if(value !== '2') {
          this.$refs.dept.setCheckedKeys([]);
        }
      },
      /** 分配数据权限操作 */
      handleDataScope(row) {
        this.reset();
        const deptTreeSelect = this.getDeptTree(row.roleId);
        getRole(row.roleId).then(response => {
          this.form = response.data;
          this.openDataScope = true;
          this.$nextTick(() => {
            deptTreeSelect.then(res => {
              this.$refs.dept.setCheckedKeys(res.checkedKeys);
            });
          });
          this.title = "分配数据权限";
        });
      },
      /** 分配用户操作 */
      handleAuthUser: function(row) {
        const roleId = row.roleId;
        this.$router.push("/system/role-auth/user/" + roleId);
      },
      // 取消按钮（数据权限）
      cancelDataScope() {
        this.openDataScope = false;
        this.reset();
      },
      /** 提交按钮（数据权限） */
      submitDataScope() {
        if (this.form.roleId != undefined) {
          this.form.deptIds = this.getDeptAllCheckedKeys();
          dataScope(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.openDataScope = false;
            this.getList();
          });
        }
      },
      // 所有部门节点数据
      getDeptAllCheckedKeys() {
        // 目前被选中的部门节点
        let checkedKeys = this.$refs.dept.getCheckedKeys();
        // 半选中的部门节点
        let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
        checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
        return checkedKeys;
      },
    },





  }
</script>
