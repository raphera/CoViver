<style scoped>
.q-page {
  background: #f5f5f5;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes translate-animation {
  0% {
    transform: translateY(200%);
    opacity: 0;
    visibility: hidden;
  }

  100% {
    transform: translateY(0%);
    opacity: 1;
    visibility: visible;
  }
}


.title-transition {
  bottom: 100%;
  animation-name: translate-animation;
  animation-duration: 2s;
  animation-fill-mode: forwards;
}

.card-transition {
  z-index: 2;
}
</style>

<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="flex flex-center q-pa-md position-relative">

      <h1 class="logo-font title-transition" style="position: relative; z-index: 1; color: #333;">CoViver</h1>

      <q-card class="full-width q-pa-md card-transition" style="max-width: 600px">
        <div class="row">
          <div class="col-12 col-md-4 flex flex-center">
            <q-img class="q-ma-md" src="~assets/logo/coviver-logo.svg" alt="CoViver logo"
              style="height: auto; min-height: 137px; width: 120px;" />
          </div>

          <q-separator vertical inset class="q-mx-md" v-if="quasar.screen.gt.sm" />

          <div class="col-12 col-md-7 flex flex-center q-mb-sm q-mt-sm">
            <q-form @submit.prevent="isRegistering ? onRegister : onLogin" class="q-gutter-x-xs q-gutter-y-lg full-width">
              <TransitionGroup name="fade">
                <q-input key="emailInput" outlined v-model="email" label="Email" type="email" />
                <q-input key="nameInput" v-if="isRegistering" outlined v-model="name" label="Nome" type="text"
                  class="q-mt-md" />
                <q-input key="passwordInput" outlined v-model="password" label="Senha" type="password" class="q-mt-md" />
              </TransitionGroup>
            </q-form>
          </div>
        </div>

        <div class="row justify-center q-gutter-x-xs q-gutter-y-lg">
          <div v-if="!isRegistering" class="justify-center q-gutter-x-xs q-gutter-y-lg">
            <q-btn outline @click="isRegistering = !isRegistering" label="Registrar" class="q-mt-md" icon="edit" />
            <q-btn outline style="color: #333; background: #333;" type="submit" label="Login" class="q-mt-md"
              @click="onLogin" icon="login" />
          </div>
          <div v-else class="justify-center q-gutter-x-xs q-gutter-y-lg">
            <q-btn outline @click="isRegistering = !isRegistering" label="Voltar para o login" class="q-mt-md"
              icon="arrow_back" />
            <q-btn outline style="color: #333; background: #333;" type="submit" label="Registrar" class="q-mt-md"
              @click="onRegister" icon="person_add" />
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useSystemMessagesStore } from 'src/stores/system-messages-store';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { AxiosError } from 'axios';
import { MessageLevel } from 'src/models/MessageModel';

export default defineComponent({
  data() {
    return {
      name: '',
      email: '',
      password: '',
      isRegistering: false
    };
  },

  setup() {
    const router = useRouter();
    const auth = useAuthStore();
    const systemMessages = useSystemMessagesStore();
    const quasar = useQuasar()

    return {
      router,
      auth,
      systemMessages,
      quasar
    };
  },
  methods: {
    async onRegister() {
      try {
        this.quasar.loading.show()
        const response = await api.post('/api/users', {
          name: this.name,
          email: this.email,
          password: this.password,
        });

        this.isRegistering = false;

        this.systemMessages.addMessage({ level: MessageLevel.Success, text: 'Usuário registrado com sucesso' });
      } catch (error) {
        const systemMessagesStore = useSystemMessagesStore();

        if (error instanceof AxiosError && error.response) {
          switch (error.response.status) {
            case 401:
              systemMessagesStore.addMessage({ level: MessageLevel.Error, text: 'Credenciais inválidas', details: error.response.data });
              break;
            case 404:
              systemMessagesStore.addMessage({ level: MessageLevel.Error, text: 'Usuário não encontrado', details: error.response.data });
              break;
            default:
              systemMessagesStore.addMessage({ level: MessageLevel.Error, text: 'Erro ao registrar usuário', details: error.response.data });
              break;
          }
        } else if (error instanceof Error) {
          systemMessagesStore.addMessage({ level: MessageLevel.Error, text: 'Erro não esperado', details: error.message });
        }

        throw error;
      } finally {
        this.quasar.loading.hide()
      }
    },
    async onLogin() {
      try {
        this.quasar.loading.show()
        await this.auth.login({ email: this.email, password: this.password });
        this.router.push({ name: 'Inicio' });
        this.quasar.loading.hide()
      } catch (error) {
        console.error(error);
      } finally {
        this.quasar.loading.hide()
      }
    },
  }
});
</script>

