<template>
  <div class="component-container">
    <el-card class="project-card">
      <template #header>
        <span class="fw-b">项目简介</span>
      </template>
      <div class="project-card__main">
        <!-- 项目简介 -->
        <el-link target="_blank" type="primary" href="">
          xiliu-admin
        </el-link>
        是基于Spring Boot 2.5、Vue2、Element-Plus、uni-app等主流技术栈构建的一整套全栈项目，
        涉及
        <el-link
          target="_blank"
          type="primary"
          href=""
        >后端服务</el-link
        >
        、
        <el-link
          target="_blank"
          type="success"
          href=""
        >前端管理</el-link
        >
        、
        <el-link
          target="_blank"
          type="warning"
          href=""
        >微信小程序
        </el-link>
        等多端的开发。
        <el-divider />

        <!-- 源码地址 -->
        <el-row :gutter="10">
          <el-col :span="6">
            <el-badge value="免费开源" class="fw-b"> 项目地址 </el-badge>
          </el-col>
          <el-col :span="6">
            <el-link
              target="_blank"
              type="warning"
              href=""
            >官方文档</el-link
            >
          </el-col>
          <el-col :span="6">
            <el-link
              target="_blank"
              type="primary"
              href=""
            >Github</el-link
            >
          </el-col>
          <el-col :span="6">
            <el-link
              target="_blank"
              type="success"
              href=""
            >码云</el-link
            >
          </el-col>
        </el-row>
        <el-divider />
        <!-- 技术栈 -->
        <el-row :gutter="10">
          <el-col :span="6" class="fw-b"> 后端技术栈 </el-col>
          <el-col :span="18">
            Spring Boot、Spring Security、JWT...
          </el-col>
        </el-row>
        <el-divider />
        <el-row :gutter="10">
          <el-col :span="6" class="fw-b"> 前端技术栈 </el-col>
          <el-col :span="18">
            Vue2、Element-UI、uni-app、vue-element-admin ...
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'index',
  };
</script>

<style lang="scss" scoped>
  .component-container {
    .project-card {
      font-size: 14px;
      &__main {
        line-height: 28px;
        height: 320px;
        overflow-y: auto;
        overflow-x: hidden;
      }
    }
    .fw-b {
      font-weight: bold;
    }
  }
</style>
