<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, watch, onMounted } from "vue";

const { user, clear: clearSession } = useUserSession();

const loading = ref(true);

const auth = useAuthStore();
const userName = auth.userName;
const isAdmin = auth.isAdmin;

console.log({ isAdmin });

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 300); // short delay to allow CSS/Ant styles to load
});

async function logout() {
  await clearSession();
  await navigateTo("/login");
}

const collapsed = ref(false);
const router = useRouter();
const route = useRoute();

const selectedKeys = ref([route.path]);

// Sync selected menu item with route
watch(
  () => route.path,
  (newPath: any) => {
    console.log({ newPath });
    selectedKeys.value = [newPath];
  }
);
</script>
<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      style="min-height: 100vh"
    >
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="/dashboard">
          <NuxtLink to="/dashboard">
            <div class="flex items-center">
              <AppstoreOutlined />
              <span>Dashboard</span>
            </div>
          </NuxtLink>
        </a-menu-item>
        <a-menu-item key="/users">
          <NuxtLink to="/users">
            <div class="flex items-center">
              <TeamOutlined />
              <span>Users</span>
            </div>
          </NuxtLink>
        </a-menu-item>
        <a-sub-menu key="settings-sub" v-if="isAdmin">
          <template #title>
            <span>
              <SettingOutlined />
              <span>Settings</span>
            </span>
          </template>
          <a-menu-item key="/admin/roles">
            <NuxtLink to="/admin/roles">
              <div class="flex items-center">
                <span>Roles</span>
              </div>
            </NuxtLink>
          </a-menu-item>
          <a-menu-item key="/admin/assign-role">
            <NuxtLink to="/admin/assign-role">
              <div class="flex items-center">
                <span>Assign Role</span>
              </div>
            </NuxtLink>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item v-if="user" key="logout">
          <div class="flex items-center">
            <LogoutOutlined />
            <span @click="logout">Logout</span>
          </div>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding-left: 20px">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
      </a-layout-header>
      <div class="user-profile-container">
        <a-avatar
          size="large"
          :style="{ backgroundColor: color, verticalAlign: 'middle' }"
          :gap="gap"
        >
          {{ userName }}
        </a-avatar>
      </div>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff' }"
      >
        <div v-if="loading">
          <a-skeleton active :paragraph="{ rows: 4 }" />
        </div>
        <slot v-else />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
.user-profile-container {
  position: absolute;
  right: 0;
  margin-right: 20px;
  width: 194px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
