<template>
  <q-page class="flex flex-center">
    <q-card class="full-width q-pa-md" style="max-width: 400px">
      <!-- <q-card-section class="flex flex-center">
        <q-icon name="lock" size="100px" class="q-my-md" />
      </q-card-section> -->
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>
      <form @submit.prevent="onLogin">
        <q-card-section>
          <q-input outlined v-model="email" label="Email" type="email" />
          <q-input outlined v-model="password" label="Password" type="password" class="q-mt-md" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat type="submit" label="Login" class="full-width" />
        </q-card-actions>
      </form>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const auth = useAuthStore();
    const router = useRouter();

    const email = ref('');
    const password = ref('');

    const onLogin = async () => {
      try {
        await auth.login({ email: email.value, password: password.value });
        router.push({ name: 'Home' });
      } catch (error) {
        console.error(error);
      }
    };

    return { email, password, onLogin };
  }
});
</script>

<style scoped>
.q-page {
  background: #f5f5f5;
}
</style>
