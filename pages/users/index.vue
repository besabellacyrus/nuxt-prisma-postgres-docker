<script setup lang="ts">
// import { ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core'
import { useFetch } from '#app'
import { message, Modal } from 'ant-design-vue'
import { DeleteTwoTone, ExclamationCircleOutlined } from '@ant-design/icons-vue';

definePageMeta({
  middleware: ['authenticated'],
  layout: 'main',
})

const formRef = ref()

const formState = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
})

const users = ref([]);
const deletedUsers = ref([]);

const searchQuery = ref('');

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return users.value
  return users.value.filter((user: { firstName: string; lastName: string; email: string; }) => {
    const first = user.firstName?.toLowerCase() || ''
    const last = user.lastName?.toLowerCase() || ''
    const email = user.email?.toLowerCase() || ''
    const query = searchQuery.value.toLowerCase()
    return first.includes(query) || last.includes(query) || email.includes(query)
  })
})

const filteredDeletedUsers = computed(() => {
  if (!searchQuery.value.trim()) return deletedUsers.value
  return deletedUsers.value.filter((user: { firstName: string; lastName: string; email: string; }) => {
    const first = user.firstName?.toLowerCase() || ''
    const last = user.lastName?.toLowerCase() || ''
    const email = user.email?.toLowerCase() || ''
    const query = searchQuery.value.toLowerCase()
    return first.includes(query) || last.includes(query) || email.includes(query)
  })
})

const total = ref(0)
const deletedUserTotal = ref(0)
const loading = ref<boolean>(false)
const deletedUserLoading = ref<boolean>(false)
const showModal = ref<boolean>(false)
const isEdit = ref<boolean>(false)
// tab key
const activeKey = ref('1');

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: any) => `Total ${total} users`,
  showSizeChanger: true,
  pageSizeOptions: ['5', '10', '20', '50'],
})

const deletedUserPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: any) => `Total ${total} users`,
  showSizeChanger: true,
  pageSizeOptions: ['5', '10', '20', '50'],
})

const fetchDeletedUsers = async () => {
  deletedUserLoading.value = true
  loading.value = true
  const { data } = await useFetch(`/api/users`, {
    params: {
      page: deletedUserPagination.value.current,
      pageSize: deletedUserPagination.value.pageSize,
      search: searchQuery.value,
      active: false
    },
  })

  deletedUsers.value = data.value?.data || []
  deletedUserTotal.value = data.value?.total || 0
  deletedUserPagination.value.total = deletedUserTotal.value
  deletedUserLoading.value = false
}


const fetchUsers = async () => {
  loading.value = true
  const { data } = await useFetch(`/api/users`, {
    params: {
      page: pagination.value.current,
      pageSize: pagination.value.pageSize,
      search: searchQuery.value,
      active: true
    },
  })
  users.value = data.value?.data || []
  total.value = data.value?.total || 0
  pagination.value.total = total.value
  loading.value = false
}

const onSearch = useDebounceFn(() => {
  pagination.current = 1 // reset to first page on new search
  fetchUsers()
}, 300)

watchEffect(fetchUsers)

// Watch pagination changes
watch(() => [pagination.value.current, pagination.value.pageSize],
  fetchUsers,
  { immediate: true }
)

watch(() => [deletedUserPagination.value.current, deletedUserPagination.value.pageSize],
  fetchDeletedUsers,
  { immediate: true }
)

const handleTableChange = (paginationConfig: { current: any; pageSize: any }) => {
  pagination.value.current = paginationConfig.current
  pagination.value.pageSize = paginationConfig.pageSize
}

const handleTableChangeDeletedUsers = (paginationConfig: { current: any; pageSize: any }) => {
  deletedUserPagination.value.current = paginationConfig.current
  deletedUserPagination.value.pageSize = paginationConfig.pageSize
}

const showAddModal = () => {
  showModal.value = true
}

const showEditModal = (record: any) => {
  console.log({ record })
  isEdit.value = true
  formState.value = { ...record }
  showModal.value = true
}

const handleOk = async () => {
  console.log('handle OK run')
  try {
    await formRef.value.validate()
    loading.value = true

    const url = isEdit.value ? `/api/users/${formState.value.id}` : '/api/users'
    const method = isEdit.value ? 'PUT' : 'POST'

    console.log({
      val: formState.value
    })

    await $fetch(url, {
      method: method,
      body: formState.value,
      server: false
    })


    message.success(isEdit.value ? "User updated successfully" : 'User added successfully')

    fetchUsers() // Refresh table
    showModal.value = false
    isEdit.value = false
    formState.value = {}
    formRef.value.resetFields()
  } catch (err) {
    message.error(isEdit.value ? 'Failed to edit user' : 'Failed to add user')
  } finally {

    loading.value = false

  }
}

const handleCancel = () => {
  showModal.value = false
}

const userColumns = [
  { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
  { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Operation', dataIndex: 'operation', key: 'operation' }
]

const userColumnsCsv = [
  { title: 'UUID', dataIndex: 'id', key: 'id' },
  { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
  { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
]

const deletedUserColumns = [
  { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
  { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Operation', dataIndex: 'operation', key: 'operation' }
]

function showRestoreConfirm(userId: string) {
  Modal.confirm({
    title: 'Are you sure you want to Restore this user?',
    icon: h(ExclamationCircleOutlined),
    content: 'This action will restore the user.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'Cancel',
    async onOk() {
      try {
        await $fetch('/api/users/restore', {
          method: 'POST',
          body: { id: userId }
        })

        fetchUsers()
        fetchDeletedUsers()
        message.success('User restored successfully')
      } catch (err) {
        console.error('Failed to restore user:', err)
      }
    }
  })
}

function showPermanentDeleteConfirm(userId: string) {
  Modal.confirm({
    title: 'Are you sure you want to Permanent Delete this user?',
    icon: h(ExclamationCircleOutlined),
    content: 'This action will permanent delete the user.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'Cancel',
    async onOk() {
      try {
        const { data, error } = await useFetch(`/api/users/delete`, {
          method: 'POST',
          body: { id: userId }
        })
        message.success('User permanently deleted successfully')
        if (!error.value) {
          fetchDeletedUsers()
        }
      } catch (err) {
        console.error('Failed to delete user:', err)
      }
    }
  })
}

function showDeleteConfirm(userId: string) {
  Modal.confirm({
    title: 'Are you sure you want to Delete this user?',
    icon: h(ExclamationCircleOutlined),
    content: 'This action will soft-delete the user.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'Cancel',
    async onOk() {
      try {
        await $fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          body: formState.value
        })
        fetchUsers()
        fetchDeletedUsers()
        message.success('User deleted successfully')
      } catch (err) {
        console.error('Failed to delete user:', err)
      }
    }
  })
}

const confirmPasswordValidator =  (_: any, value: any) => {
  if (value === formState.value.password) {
    return Promise.resolve()
  }
  return Promise.reject('Passwords do not match')
}

function exportToCSV() {
  const headers = userColumnsCsv.map(col => col.title)
  const keys = userColumnsCsv.map(col => col.dataIndex)

  const csvRows = [
    headers.join(','), // Header row
    ...users.value.map(row => keys.map(key => `"${(row[key] ?? '')}"`).join(','))
  ]

  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'users.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

</script>

<template>
  <div class="table-header">
    <a-input
      v-model:value="searchQuery"
      placeholder="Search first, last name or email"
      allow-clear
      class="mb-4 w-64 search-input"
      @input="onSearch"
    />
    <a-button class="pl-2" type="primary" @click="showAddModal">
      <UserAddOutlined /> Add
    </a-button>
    <a-button class="export-btn" type="primary" @click="exportToCSV">
      <CloudDownloadOutlined /> Export
    </a-button>
  </div>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="Users">
      <a-table
        :key="'users-table'"
        :columns="userColumns"
        :dataSource="filteredUsers"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a><DeleteTwoTone @click="showDeleteConfirm(record.id)" two-tone-color="#FF0000"/></a>
             |
            <a><EditOutlined  @click="showEditModal(record)" two-tone-color="#008000"/></a>
          </template>
        </template>
      </a-table>
    </a-tab-pane>
    <a-tab-pane key="2" tab="Archived">
      <a-table
        :key="'archived-users-table'"
        :columns="deletedUserColumns"
        :dataSource="filteredDeletedUsers"
        :pagination="deletedUserPagination"
        :loading="deletedUserLoading"
        @change="handleTableChangeDeletedUsers"
        rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a><DeleteTwoTone @click="showPermanentDeleteConfirm(record.id)" two-tone-color="#FF0000"/></a>
            |
            <a><UndoOutlined  @click="showRestoreConfirm(record.id)" two-tone-color="#008000"/></a>
          </template>
        </template>
      </a-table>
    </a-tab-pane>
  </a-tabs>
  <a-modal
    :get-container="false"
    v-model:visible="showModal"
    :title="isEdit ? 'Edit User' : 'Add User'"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form  :model="formState" :rules="{
      firstName: [{ required: true, message: 'First Name is required' },
      { min: 1, message: 'First Name must be at least 1 characters' }],
      lastName: [{ required: true, message: 'Last Name is required' },
      { min: 1, message: 'Last Name must be at least 1 characters' }],
      email: [
        { required: true, message: 'Email is required' },
        { type: 'email', message: 'Invalid email' }
      ],
      password: [
        { required: true, message: 'Password is required' },
        { min: 6, message: 'Password must be at least 6 characters' }
      ],
      confirmPassword: [
        { required: true, message: 'Please confirm your password' },
        { validator: confirmPasswordValidator, trigger: 'blur' }
      ]
    }" ref="formRef" layout="vertical">
      <a-form-item label="First Name" name="firstName">
        <a-input v-model:value="formState.firstName" placeholder="Enter First name" />
      </a-form-item>
      <a-form-item label="Last Name" name="lastName">
        <a-input v-model:value="formState.lastName" placeholder="Enter Last name" />
      </a-form-item>
      <a-form-item label="Email" name="email">
        <a-input v-model:value="formState.email" type="email" placeholder="Enter email" />
      </a-form-item>
      <a-form-item v-if="!isEdit" label="Password" name="password">
        <a-input v-model:value="formState.password" type="password" placeholder="Enter password" />
      </a-form-item>
      <a-form-item v-if="!isEdit" label="Confirm Password" name="confirmPassword">
        <a-input v-model:value="formState.confirmPassword" type="password" placeholder="Enter confirm password" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
.table-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.export-btn {
  margin-left: 10px;
}

.search-input {
  margin-right: 10px;
}

</style>
