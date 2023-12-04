<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="row items-center no-wrap" style="align-items: center;">
            <q-img src="~assets/logo/coviver-logo.svg" alt="CoViver logo"
              style="height: auto; width: 24px; filter: brightness(0) invert(1);" />
            <p class="q-ma-sm" style="color: white;">CoViver</p>
          </div>
        </q-toolbar-title>

        <q-btn-dropdown flat round unelevated>
          <template v-slot:label>
            <q-icon name="account_circle" size="2em" class="q-mr-sm" />
            <span>{{ abbreviatedName }}</span>
          </template>
          <q-list style="min-width: 100px" content-style="width: auto">
            <q-item clickable v-close-popup @click="logout">
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="200" :breakpoint="500" bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="route in drawerRoutes" :key="route.path">
            <q-item clickable :active="$route.path === route.path" v-ripple @click="router.push(route.path)">
              <q-item-section avatar>
                <q-icon :name="route.meta.icon" />
              </q-item-section>
              <q-item-section>
                {{ route.name }}
              </q-item-section>
            </q-item>
            <q-separator v-if="route.meta.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter, useRoute, RouteRecordRaw } from 'vue-router';
import router from 'src/router';

export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const authStore = useAuthStore();
    const router = useRouter();

    const userName = computed(() => authStore.tokenData?.name);

    const getDrawerRoutes = (routes: readonly RouteRecordRaw[], parentPath = ''): RouteRecordRaw[] => {
      let drawerRoutes: RouteRecordRaw[] = [];
      for (const route of routes) {
        const fullPath = parentPath + route.path;
        if (route.meta && route.meta.showInDrawer) {
          drawerRoutes.push({ ...route, path: fullPath });
        }
        if (route.children) {
          drawerRoutes = drawerRoutes.concat(getDrawerRoutes(route.children, fullPath));
        }
      }
      return drawerRoutes;
    };

    const drawerRoutes = computed(() => getDrawerRoutes(router.options.routes));

    const logout = async () => {
      await authStore.logout();
      router.push('/login');
    };

    const abbreviatedName = computed(() => {
      if (!userName.value) return '';
      const parts = userName.value.split(' ');
      if (parts.length === 1) return parts[0];
      return `${parts[0]} ${parts[1].charAt(0)}.`;
    });

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      abbreviatedName,
      logout,
      router,
      drawerRoutes
    }
  }
});
</script>
