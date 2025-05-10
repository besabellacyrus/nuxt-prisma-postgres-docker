
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import {
MenuUnfoldOutlined,
MenuFoldOutlined,
TeamOutlined,
AppstoreOutlined,
SettingOutlined
} from '@ant-design/icons-vue';
const { user, clear: clearSession } = useUserSession()


const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 300) // short delay to allow CSS/Ant styles to load
})

 async function logout() {
  await clearSession()
  await navigateTo('/login')
}

const collapsed = ref(false)
const router = useRouter()
const route = useRoute()

const selectedKeys = ref([route.path])

// Sync selected menu item with route
watch(
  () => route.path,
  (newPath: any) => {
    console.log({ newPath })
    selectedKeys.value = [newPath]
  }
)


// const selectedKeys = ref<string[]>(['1']);
// const collapsed = ref<boolean>(false);
</script>
<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible style="min-height: 100vh">
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
        <a-menu-item key="/settings">
            <NuxtLink to="/settings">
              <div class="flex items-center">
                <SettingOutlined />
                <span>Settings</span>
              </div>
            </NuxtLink>
        </a-menu-item>
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
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
      </a-layout-header>
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
</style>