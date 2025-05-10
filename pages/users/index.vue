<script setup lang="ts">
// import { ref, watch } from 'vue';
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

const users = ref([])
const deletedUsers = ref([])

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
  const { data } = await useFetch(`/api/users/deletedUsers`, {
    params: {
      page: deletedUserPagination.value.current,
      pageSize: deletedUserPagination.value.pageSize,
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
    },
  })
  users.value = data.value?.data || []
  total.value = data.value?.total || 0
  pagination.value.total = total.value
  loading.value = false
}

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
  try {
    console.log('ok called');
    await formRef.value.validate()
    loading.value = true

    const url = isEdit.value ? `/api/users/${formState.value.id}` : '/api/users'
    const method = isEdit.value ? 'PUT' : 'POST'

    console.log({
      val: formState.value
    })

    const { data, error } = await useFetch(url, {
      method: method,
      body: formState.value,
      server: false
    })

    if (error.value) {
      message.error(isEdit.value ? 'Failed to edit user' : 'Failed to add user')
    } else {
      message.success(isEdit.value ? "User updated successfully" : 'User added successfully')
      formRef.value.resetFields()
      showModal.value = false
      isEdit.value = false
      formState.value = {}
    }
    fetchUsers() // Refresh table
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

const deletedUserColumns = [
  { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
  { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Operation', dataIndex: 'operation', key: 'operation' }
]

const addUserRules = {
  firstName: [{ required: true, message: 'First Name is required' }],
  lastName: [{ required: true, message: 'Last Name is required' }],
  email: [
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Invalid email' }
  ],
  password: [
    { required: true, message: 'Password is required' },
  ]
}

const editUserRules = {
  firstName: [{ required: true, message: 'First Name is required' }],
  lastName: [{ required: true, message: 'Last Name is required' }],
  email: [
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Invalid email' }
  ]
}

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
        const { data, error } = await useFetch(`/api/users/${userId}`, {
          method: 'DELETE',
          body: formState.value
        })

        const restoredUser  = await $fetch('/api/users/restore', {
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
        const { data, error } = await useFetch(`/api/users/${userId}`, {
          method: 'DELETE',
          body: formState.value
        })
        message.success('User deleted successfully')
        if (!error.value) {
          fetchUsers()
          fetchDeletedUsers()
        }
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
</script>

<template>
  <div class="table-header">
    <a-button type="primary" @click="showAddModal">
      Add User
    </a-button>
  </div>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="Users">
      <a-table
        :columns="userColumns"
        :dataSource="users"
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
    <a-tab-pane key="2" tab="Deleted">
      <a-table
        :columns="deletedUserColumns"
        :dataSource="deletedUsers"
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

</style>
