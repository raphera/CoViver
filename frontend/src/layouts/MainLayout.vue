<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="row items-center no-wrap" style="align-items: center;">
            <q-img src="~assets/logo/coviver-logo.svg" alt="CoViver logo"
              style="height: auto; width: 24px; filter: brightness(0) invert(1);" />
            <p class="logo-font q-ma-sm" style="color: white;">CoViver</p>
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

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const authStore = useAuthStore();
    const router = useRouter();
    const userName = computed(() => authStore.tokenData?.name);

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
      logout
    }
  }
});
</script>
