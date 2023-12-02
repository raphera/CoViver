<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="column items-center">
      <h1 class="logo-font" style="margin-bottom: 80px; color: #333;">CoViver</h1>
      <q-card class="full-width q-pa-md" style="max-width: 600px">
        <div class="row">
          <div class="col-12 col-md-4 flex flex-center">
            <q-img class="q-ma-md" src="~assets/logo/coviver-logo.svg" alt="CoViver logo"
              style="height: auto; width: 200px;" />
          </div>

          <q-separator vertical inset class="q-mx-md" v-if="$q.screen.gt.sm" />

          <div class="col-12 col-md-7">
            <form @submit.prevent="onLogin">
              <q-card-section>
                <q-input outlined v-model="email" label="Email" type="email" />
                <q-input outlined v-model="password" label="Password" type="password" class="q-mt-md" />
                <q-btn outline style="color: #333; background: #333;" type="submit" label="Login"
                  class="q-mt-md full-width" />
              </q-card-section>
            </form>
          </div>
        </div>
      </q-card>
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
    const splitterModel = ref(50);

    const onLogin = async () => {
      try {
        await auth.login({ email: email.value, password: password.value });
        router.push({ name: 'Home' });
      } catch (error) {
        console.error(error);
      }
    };

    return { email, password, onLogin, splitterModel };
  }
});
</script>

<style scoped>
.q-page {
  background: #f5f5f5;
}
</style>
