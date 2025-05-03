<template>
  <div class="login-container">
    <a-card class="login-card" title="Login">
      <a-form layout="vertical">
        <a-form-item label="Email">
          <a-input v-model="email" type="email" placeholder="Enter your email" />
        </a-form-item>

        <a-form-item label="Password">
          <a-input-password v-model="password" placeholder="Enter your password" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" block>Login</a-button>
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
import { ref } from 'vue'

const email = ref('')
const password = ref('')
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