<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="职务管理" name="first">
      <post ref="post" />
    </el-tab-pane>
    <el-tab-pane label="员工管理" name="second">
      <staff ref="staff" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import post from "./components/post";
  import staff from "./components/staff";

  export default {
    components: { post,staff },
    data() {
      return {
        activeName: 'first',
      };
    },
    methods: {
      handleClick(tab, event) {
        if (tab.name === 'second') {
          this.$refs.staff.getPostList()
        }
      },
    }
  };
</script>
<style lang = "scss" scoped>
  ::v-deep .el-tabs__header {
    padding: 10px 20px 0px 20px;
  }
</style>
