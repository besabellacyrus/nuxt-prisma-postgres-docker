import { defineStore } from "pinia";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref<null | {
      id: number;
      name: string;
      email: string;
      firstName: string;
      roleName: "User" | "Admin";
    }>(null);
    const token = ref<null | string>(null);

    const isAdmin = computed(() => user.value?.roleName === "Admin");
    const isAuthenticated = computed(() => !!user.value);
    const userName = computed(() => user.value?.firstName);

    async function fetchUser() {
      try {
        const data = await $fetch("/api/user/me");
        console.log({ me: data });
        user.value = data;
      } catch (e) {
        user.value = null;
      }
    }

    async function login(body: any) {
      try {
        const res = await $fetch("/api/auth/login", {
          method: "POST",
          body: body,
          credentials: "include",
        });

        user.value = res.user;
        token.value = res.token;

        // optionally store in localStorage
        localStorage.setItem("token", res.token);
        return res;
      } catch (err: any) {
        throw new Error(err.data?.message ?? "Login failed");
      }
    }

    function logout() {
      user.value = null;
      token.value = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    // const loadUserFromStorage = () => {
    //   const storedUser = localStorage.getItem("user");
    //   if (storedUser) {
    //     user.value = JSON.parse(storedUser);
    //   }
    // };

    // Initialize the store by loading user data from localStorage
    // loadUserFromStorage();

    return {
      user,
      isAuthenticated,
      isAdmin,
      userName,
      fetchUser,
      logout,
      login,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage, // or persistedState.sessionStorage
    },
  }
);

// export const useAuthStore = defineStore("auth", {
//   state: () => ({
//     user: null as null | { id: number; firstName: string; email: string },
//     token: null as null | string,
//   }),
//   getters: {
//     userName: (state) => state.user?.firstName || "Guest",
//   },
//   actions: {
//     async login(body: any) {
//       try {
//         const res = await $fetch("/api/auth/login", {
//           method: "POST",
//           body: body,
//           credentials: "include",
//         });

//         this.user = res.user;
//         this.token = res.token;

//         // optionally store in localStorage
//         localStorage.setItem("token", res.token);
//         return res;
//       } catch (err: any) {
//         throw new Error(err.data?.message || "Login failed");
//       }
//     },
//     logout() {
//       this.user = null;
//       this.token = null;
//       localStorage.removeItem("token");
//     },
//   },
// });
