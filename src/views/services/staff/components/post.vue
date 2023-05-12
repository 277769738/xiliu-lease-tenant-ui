<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search" />
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="queryParams" size="small" label-width="68px">
            <el-form-item label="名称" prop="roleName">
              <el-input
                v-model="queryParams.roleName"
                placeholder="请输入职务名称"
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
    </el-card>

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button style="margin-left: 20px" type="primary" plain icon="el-icon-circle-plus" size="mini" @click="handleAdd" v-hasPermi="['services:post:create']">添加</el-button>
    </el-card>

    <div class="table-container">
      <el-table ref="adminTable" v-loading="visible" :data="postList" style="width: 100%;" border>
        <el-table-column label="部门" align="center">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="职务" align="center">
          <template slot-scope="scope">{{ scope.row.roleName }}</template>
        </el-table-column>
        <el-table-column label="权限分配" align="center">
          <template slot-scope="scope">
            <div :style="{ color: scope.row.isAuth ? 'green' : 'red' }">
              {{ scope.row.isAuth | setAuthText}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">
            <span>{{ dateTimeFormat(scope.row.createdTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleAuthMenu(scope.row)"
              v-hasPermi="['system:role:auth']"
            >分配权限</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['services:post:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['services:post:remove']"
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

      <!-- 添加或修改对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item  prop="description">
            <el-input v-model="form.description" placeholder="请输入部门名称" >
              <template slot="prepend">部门名称</template>
            </el-input>
          </el-form-item>
          <el-form-item  prop="roleName">
            <el-input v-model="form.roleName" placeholder="请输入职务名称" >
              <template slot="prepend">职务名称</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
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

    </div>
  </div>
</template>

<script>
  import { listPost, getPost, delPost, addPost, updatePost } from "@/api/services/post";
  import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/sys/menu";
  import { authRoleMenu } from '@/api/sys/role';

  export default {
    components: {  },
    data() {
      return {
        // 遮罩层
        visible: false,
        // 选中数组值
        tables: [],
        // 总条数
        total: 0,
        // 表数据
        postList: [],
        // 是否显示弹出层
        open: false,
        // 是否显示弹出层（菜单权限）
        openAuthMenu: false,
        openAuthProject: false,
        // 弹出层标题
        title: "",
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          roleName: undefined,
        },
        menuExpand: false,
        menuNodeAll: false,
        // 菜单列表
        menuOptions: [],
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          description: [
            { required: true, message: "部门名称不能为空", trigger: "blur" }
          ],
          roleName: [
            { required: true, message: "职务名称不能为空", trigger: "blur" }
          ],
        }
      };
    },
    created() {
      this.show();
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
      // 显示弹框
      show() {
        this.getList();
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          roleName: null,
          description: null,
          menuCheckStrictly: true,
        };
        this.resetForm("form");
      },
      // 查询表数据
      getList() {
        listPost(this.queryParams).then(res => {
          if (res.code === 200) {
            this.postList = res.rows;
            this.total = res.total;
          }
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
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加职务";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.roleId || this.ids
        getPost(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改职务";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.roleId != null) {
              updatePost(this.form.roleId,this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addPost(this.form).then(response => {
                this.$modal.msgSuccess("添加成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.roleId || this.ids;
        this.$modal.confirm('是否确认删除品牌分类编号为"' + ids + '"的数据项？').then(function() {
          return delPost(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
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
        this.title = "分配权限";
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
      // 所有菜单节点数据
      getMenuAllCheckedKeys() {
        // 目前被选中的菜单节点
        let checkedKeys = this.$refs.menu.getCheckedKeys();
        // 半选中的菜单节点
        let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
        checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
        return checkedKeys;
      },
      // 树权限（展开/折叠）
      handleCheckedTreeExpand(value, type) {
        if (type == 'menu') {
          let treeList = this.menuOptions;
          for (let i = 0; i < treeList.length; i++) {
            this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
          }
        }
      },
      // 树权限（全选/全不选）
      handleCheckedTreeNodeAll(value, type) {
        if (type == 'menu') {
          this.$refs.menu.setCheckedNodes(value ? this.menuOptions: []);
        }
      },
      // 树权限（父子联动）
      handleCheckedTreeConnect(value, type) {
        if (type == 'menu') {
          this.form.menuCheckStrictly = value ? true: false;
        }
      },
    }
  };
</script>
