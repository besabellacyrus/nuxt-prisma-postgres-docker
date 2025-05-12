export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore();

  if (!auth.user) {
    await auth.fetchUser();
  }

  if (auth.user?.roleName !== "Admin") {
    return navigateTo("/unauthorized"); // Or show 403 page
  }
});
