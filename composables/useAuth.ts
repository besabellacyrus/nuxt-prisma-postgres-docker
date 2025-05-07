export function useAuth() {
  const router = useRouter();

  async function logout() {
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
      await router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return { logout };
}
