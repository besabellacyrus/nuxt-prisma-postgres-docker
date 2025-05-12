export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession();
  const auth = useAuthStore();
  console.log({ auth });

  // redirect the user to the login screen if they're not authenticated
  if (!loggedIn.value) {
    return navigateTo("/login");
  }
});
