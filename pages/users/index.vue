<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFetch } from '#app'
import { message } from 'ant-design-vue'

definePageMeta({
  middleware: ['authenticated'],
  layout: 'main',
})

const formRef = ref()
const formState = ref({
  name: '',
  email: ''
})

const users = ref([])
const total = ref(0)
const loading = ref(false)
const showModal = ref(false)


const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: any) => `Total ${total} users`,
  showSizeChanger: true,
  pageSizeOptions: ['5', '10', '20', '50'],
})


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
watch(
  () => [pagination.value.current, pagination.value.pageSize],
  fetchUsers,
  { immediate: true }
)

const handleTableChange = (paginationConfig: { current: any; pageSize: any }) => {
  pagination.value.current = paginationConfig.current
  pagination.value.pageSize = paginationConfig.pageSize
}

const showAddModal = () => {
  console.log({ clickModal: true })
  showModal.value = true
  navigateTo('/users/create')
}

const handleOk = async () => {
  try {
    await formRef.value.validate()
    loading.value = true

    const { data, error } = await useFetch('/api/users', {
      method: 'POST',
      body: formState.value
    })

    if (error.value) {
      message.error('Failed to add user')
    } else {
      message.success('User added successfully')
      fetchUsers() // Refresh table
      showModal.value = false
      formRef.value.resetFields()
    }
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  showModal.value = false
}
</script>

<template>
  <div class="table-header">
    <a-button type="primary" @click="showAddModal">
      Add User
    </a-button>
  </div>
  <a-modal
    v-model:open="showModal"
    title="Add User"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :model="formState" :rules="{
      name: [{ required: true, message: 'Name is required' }],
      email: [
        { required: true, message: 'Email is required' },
        { type: 'email', message: 'Invalid email' }
      ]
    }" ref="formRef" layout="vertical">
      <a-form-item label="Name" name="name">
        <a-input v-model:value="formState.name" placeholder="Enter name" />
      </a-form-item>
      <a-form-item label="Email" name="email">
        <a-input v-model:value="formState.email" placeholder="Enter email" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-table
    :columns="[
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Email', dataIndex: 'email', key: 'email' }
    ]"
    :dataSource="users"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    rowKey="id"
  />

</template>

<style scoped>
.table-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}
.ant-modal {
  z-index: 9999 !important;
}
</style>
