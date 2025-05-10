<template>
  <div class="login-container">
    <a-card class="login-card" title="Login">
      <a-form
        layout="vertical"
        @finish="onSubmit"
        :model="form"
        :rules="rules">
        <a-form-item label="Email">
          <a-input v-model:value="form.email" type="email" placeholder="Enter your email" />
        </a-form-item>

        <a-form-item label="Password">
          <a-input-password v-model:value="form.password" placeholder="Enter your password" />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            block
            :loading="loading"
          >
            Login
          </a-button>
        </a-form-item>

        <div class="footer-links">
          <a-typography-link href="#">Forgot password?</a-typography-link>
          <a-divider type="vertical" />
          <a-typography-link href="#">Create account</a-typography-link>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
const { loggedIn, user, fetch: refreshSession } = useUserSession()

const loading = ref(false)
const error = ref('')

const form = ref({
  email: '',
  password: '',
})

const rules = {
  email: [{ required: true, message: 'Email is required', type: 'email' }],
  password: [{ required: true, message: 'Password is required' }],
}

const onSubmit = async () => {
  error.value = ''
  loading.value = true;

  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value,
      credentials: 'include',
    });

    console.log({ res, pushing:true });

  if (res) {
      await refreshSession()
      await navigateTo('/dashboard')
    }
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Login failed'
    message.error('Something went wrong. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.footer-links {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}
</style>