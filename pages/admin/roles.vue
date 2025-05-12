<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { useFetch } from "#app";
import { message, Modal } from "ant-design-vue";
import {
  DeleteTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";

definePageMeta({
  middleware: ["authenticated", "admin"],
  layout: "main",
});

const formRef = ref();

const formState = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const users = ref([]);
const deletedUsers = ref([]);

const roles = ref([]);

const searchQuery = ref("");

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return users.value;
  return users.value.filter(
    (user: { firstName: string; lastName: string; email: string }) => {
      const first = user.firstName?.toLowerCase() || "";
      const last = user.lastName?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const query = searchQuery.value.toLowerCase();
      return (
        first.includes(query) || last.includes(query) || email.includes(query)
      );
    }
  );
});

const filteredRoles = computed(() => {
  if (!searchQuery.value.trim()) return roles.value;
  return roles.value.filter((role: { name: string }) => {
    const name = role.name?.toLowerCase() || "";
    const query = searchQuery.value.toLowerCase();
    return name.includes(query);
  });
});

const filteredDeletedUsers = computed(() => {
  if (!searchQuery.value.trim()) return deletedUsers.value;
  return deletedUsers.value.filter(
    (user: { firstName: string; lastName: string; email: string }) => {
      const first = user.firstName?.toLowerCase() || "";
      const last = user.lastName?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const query = searchQuery.value.toLowerCase();
      return (
        first.includes(query) || last.includes(query) || email.includes(query)
      );
    }
  );
});

const total = ref(0);
const deletedUserTotal = ref(0);
const loading = ref<boolean>(false);
const deletedUserLoading = ref<boolean>(false);
const showModal = ref<boolean>(false);
const isEdit = ref<boolean>(false);
// tab key
const activeKey = ref("1");

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: any) => `Total ${total} users`,
  showSizeChanger: true,
  pageSizeOptions: ["5", "10", "20", "50"],
});

const deletedUserPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: any) => `Total ${total} users`,
  showSizeChanger: true,
  pageSizeOptions: ["5", "10", "20", "50"],
});

const fetchDeletedUsers = async () => {
  deletedUserLoading.value = true;

  const query = new URLSearchParams({
    page: deletedUserPagination.value.current,
    pageSize: deletedUserPagination.value.pageSize,
    search: searchQuery.value,
    active: "false",
  });

  const res = await $fetch(`/api/users?${query.toString()}`);

  res.data = res.data.map((user) => ({
    ...user,
    roleName: user.role?.name,
  }));

  deletedUsers.value = res?.data || [];
  deletedUserTotal.value = res?.total || 0;
  deletedUserPagination.value.total = deletedUserTotal.value;
  deletedUserLoading.value = false;
};

const fetchUsers = async () => {
  loading.value = true;

  const query = new URLSearchParams({
    page: pagination.value.current,
    pageSize: pagination.value.pageSize,
    search: searchQuery.value,
    active: "true",
  });

  let res = await $fetch(`/api/users?${query.toString()}`);

  res.data = res.data.map((user) => ({
    ...user,
    roleName: user.role?.name,
  }));

  users.value = res?.data || [];
  total.value = res?.total || 0;
  pagination.value.total = total.value;
  loading.value = false;
};

const fetchRoles = async () => {
  loading.value = true;

  const query = new URLSearchParams({
    page: pagination.value.current,
    pageSize: pagination.value.pageSize,
    search: searchQuery.value,
    active: "true",
  });

  let res = await $fetch(`/api/admin/paginated-roles?${query.toString()}`);
  console.log({ res });
  roles.value = res?.data || [];
  total.value = res?.total || 0;
  pagination.value.total = total.value;
  loading.value = false;
};

const onSearch = useDebounceFn(() => {
  pagination.current = 1;
  fetchRoles();
}, 300);

watchEffect(fetchUsers);

watch(() => [pagination.value.current, pagination.value.pageSize], fetchRoles, {
  immediate: true,
});

// Watch pagination changes
watch(() => [pagination.value.current, pagination.value.pageSize], fetchUsers, {
  immediate: true,
});

watch(
  () => [
    deletedUserPagination.value.current,
    deletedUserPagination.value.pageSize,
  ],
  fetchDeletedUsers,
  { immediate: true }
);

const handleTableChange = (paginationConfig: {
  current: any;
  pageSize: any;
}) => {
  pagination.value.current = paginationConfig.current;
  pagination.value.pageSize = paginationConfig.pageSize;
};

const handleTableChangeDeletedUsers = (paginationConfig: {
  current: any;
  pageSize: any;
}) => {
  deletedUserPagination.value.current = paginationConfig.current;
  deletedUserPagination.value.pageSize = paginationConfig.pageSize;
};

const showAddModal = () => {
  showModal.value = true;
  isEdit.value = false;
};

const showEditModal = (record: any) => {
  console.log({ record });
  isEdit.value = true;
  formState.value = { ...record };
  showModal.value = true;
};

const handleOk = async () => {
  console.log("handle OK run");
  try {
    await formRef.value.validate();
    loading.value = true;

    const url = isEdit.value
      ? `/api/admin/paginated-roles/${formState.value.id}`
      : "/api/admin/paginated-roles";
    const method = isEdit.value ? "PUT" : "POST";

    console.log({
      val: formState.value,
    });

    const role = await $fetch(url, {
      method: method,
      body: formState.value,
      server: false,
    });

    console.log({ role });
    if (role) {
      showModal.value = false;
      message.success(
        isEdit.value ? "Role updated successfully" : "Role added successfully"
      );
      fetchRoles(); // Refresh table
      formState.value = {};
      formRef.value.resetFields();
    }
  } catch (err) {
    message.error(err.data?.message);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  showModal.value = false;
};

const roleColumns = [
  { title: "Name", dataIndex: "name", key: "name" },
  {
    title: "Status",
    dataIndex: "deletedAt",
    key: "deletedAt",
    customRender: ({ record }) => {
      console.log({ record });
      return record.deletedAt === null ? "Active" : "Inactive";
    },
  },
  { title: "Actions", dataIndex: "actions", key: "actions" },
];

const userColumns = [
  { title: "First Name", dataIndex: "firstName", key: "firstName" },
  { title: "Last Name", dataIndex: "lastName", key: "lastName" },
  { title: "Email", dataIndex: "email", key: "email" },
  {
    title: "Role",
    dataIndex: "roleName",
    key: "roleName",
  },

  { title: "Actions", dataIndex: "actions", key: "actions" },
];

const deletedUserColumns = [
  { title: "First Name", dataIndex: "firstName", key: "firstName" },
  { title: "Last Name", dataIndex: "lastName", key: "lastName" },
  { title: "Email", dataIndex: "email", key: "email" },
  {
    title: "Role",
    dataIndex: "roleName",
    key: "roleName",
  },
  { title: "Operation", dataIndex: "operation", key: "operation" },
];

function showRestoreConfirm(userId: string, name: string) {
  Modal.confirm({
    title: "Are you sure you want to Restore this user?",
    icon: h(ExclamationCircleOutlined),
    content: `This action will restore "${name}".`,
    okText: "Yes",
    okType: "danger",
    cancelText: "Cancel",
    async onOk() {
      try {
        await $fetch("/api/users/restore", {
          method: "POST",
          body: { id: userId },
        });

        fetchUsers();
        fetchDeletedUsers();
        message.success("User restored successfully");
      } catch (err) {
        console.error("Failed to restore user:", err);
      }
    },
  });
}

function showPermanentDeleteConfirm(userId: string, name: string) {
  Modal.confirm({
    title: "Are you sure you want to Permanent Delete this user?",
    icon: h(ExclamationCircleOutlined),
    content: `This action will permanent delete "${name}".`,
    okText: "Yes",
    okType: "danger",
    cancelText: "Cancel",
    async onOk() {
      try {
        const { data, error } = await useFetch(`/api/users/delete`, {
          method: "POST",
          body: { id: userId },
        });
        message.success("User permanently deleted successfully");
        if (!error.value) {
          fetchDeletedUsers();
        }
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    },
  });
}

function showDeleteConfirm(userId: string, name: string) {
  Modal.confirm({
    title: "Are you sure you want to set this role to inactive?",
    icon: h(ExclamationCircleOutlined),
    content: `This action will set this "${name}" to inactive.`,
    okText: "Yes",
    okType: "danger",
    cancelText: "Cancel",
    async onOk() {
      try {
        await $fetch(`/api/admin/paginated-roles/${userId}`, {
          method: "DELETE",
          body: formState.value,
        });
        fetchRoles();
        message.success("Role successfully inactive");
      } catch (err) {
        console.log({ err });
        message.error(err.message);
      }
    },
  });
}

const confirmPasswordValidator = (_: any, value: any) => {
  if (value === formState.value.password) {
    return Promise.resolve();
  }
  return Promise.reject("Passwords do not match");
};

function exportToCSV() {
  const headers = userColumnsCsv.map((col) => col.title);
  const keys = userColumnsCsv.map((col) => col.dataIndex);

  const csvRows = [
    headers.join(","), // Header row
    ...users.value.map((row) =>
      keys.map((key) => `"${row[key] ?? ""}"`).join(",")
    ),
  ];

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "users.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <div class="table-header">
    <a-input
      v-model:value="searchQuery"
      placeholder="Search role name"
      allow-clear
      class="mb-4 w-64 search-input"
      @input="onSearch"
    />
    <a-button class="pl-2" type="primary" @click="showAddModal">
      <div class="flex justify-center items-center space-x-2">
        <span>Add Role</span>
      </div>
    </a-button>
    <!-- <a-button class="export-btn" type="primary" @click="exportToCSV">
      <div class="flex justify-center items-center space-x-2">
        <span>Export</span>
      </div>
    </a-button> -->
  </div>
  <a-table
    :key="'users-table'"
    :columns="roleColumns"
    :dataSource="filteredRoles"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    rowKey="id"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'actions'">
        <div class="flex">
          <a-button class="mr-20" @click="showEditModal(record)">
            Edit
          </a-button>
          <a-button @click="showDeleteConfirm(record.id, record.name)" danger>
            set Inactive
          </a-button>
        </div>
      </template>
    </template>
  </a-table>
  <a-modal
    :get-container="false"
    v-model:visible="showModal"
    :title="isEdit ? 'Edit Role' : 'Add Role'"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      :model="formState"
      :rules="{
        name: [
          { required: true, message: 'Name is required' },
          { min: 1, message: 'First Name must be at least 1 characters' },
        ],
      }"
      ref="formRef"
      layout="vertical"
    >
      <a-form-item label="Role Name" name="firstName">
        <a-input v-model:value="formState.name" placeholder="Enter Role Name" />
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

.mr-20 {
  margin-right: 20px;
}
</style>
