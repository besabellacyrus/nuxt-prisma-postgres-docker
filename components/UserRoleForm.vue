<!-- components/UserRoleForm.vue -->
<template>
  <a-card title="Assign Role" style="max-width: 500px; margin: 2rem auto">
    <a-form :rules="rules" layout="vertical" @submit.prevent="onSubmit">
      <a-form-item label="User" name="userId">
        <a-select
          v-model:value="selectedUserId"
          :options="userOptions"
          :loading="loadingUsers"
        />
      </a-form-item>

      <a-form-item label="Role" name="roleId">
        <a-select
          v-model:value="selectedRoleId"
          placeholder="Select a role"
          :options="roleOptions"
          :loading="loadingRoles"
        />
      </a-form-item>

      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          :loading="submitting"
          :disabled="selectedUserId === 'Select a user'"
        >
          Assign Role
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
const selectedUserId = ref("Select a user");
const selectedRoleId = ref(2);

const userOptions = ref<any[]>([]);
const roleOptions = ref<any[]>([]);
const loadingUsers = ref(false);
const loadingRoles = ref(false);
const submitting = ref(false);

onMounted(async () => {
  loadingUsers.value = true;
  loadingRoles.value = true;

  const [users, roles] = await Promise.all([
    $fetch("/api/admin/users"),
    $fetch("/api/admin/roles"),
  ]);

  userOptions.value = users.map((u: any) => ({
    label: `${u.firstName} (${u.email})`,
    value: u.id,
  }));

  roleOptions.value = roles.map((r: any) => ({
    label: r.name,
    value: r.id,
  }));

  loadingUsers.value = false;
  loadingRoles.value = false;
});

const onSubmit = async () => {
  console.log("User ID:", selectedUserId.value);
  console.log("Role ID:", selectedRoleId.value);
  const payload = {
    userId: selectedUserId.value,
    roleId: selectedRoleId.value,
  };

  try {
    submitting.value = true;
    await $fetch("/api/admin/assign-role", {
      method: "POST",
      body: payload,
    });
    message.success("Role assigned successfully");
  } catch (e: any) {
    message.error(e?.data?.message || "Failed to assign role");
  } finally {
    submitting.value = false;
  }
};

// const onSubmite = handleSubmit(async (values) => {
//   console.log("Form submitted:", values);
//   try {
//     submitting.value = true;
//     await $fetch("/api/admin/assign-role", {
//       method: "POST",
//       body: values,
//     });
//     message.success("Role assigned successfully");
//   } catch (e: any) {
//     message.error(e?.data?.message || "Failed to assign role");
//   } finally {
//     submitting.value = false;
//   }
// });
</script>
