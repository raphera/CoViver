<template>
  <q-page class="row items-center justify-evenly">
    <div>
      <q-input v-model="email" label="Email" />
      <q-input v-model="password" label="Password" type="password" />
      <q-btn @click="onLogin" label="Login" />
    </div>
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
        await auth.login({email: email.value, password: password.value});
        router.push({ name: 'Home' });
      } catch (error) {
        console.error(error);
      }
    };

    return { email, password, onLogin };
  }
});
</script>
