import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { UserForTokenModel } from './../../../backend/src/models/UserForTokenModel'
import { AxiosError } from 'axios';
import { useSystemMessagesStore } from './system-messages-store';
import { MessageLevel } from 'src/models/MessageModel';
import { is } from 'quasar';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || null as string | null,
    refreshToken: localStorage.getItem('refresh_token') || null as string | null,
    tokenData: (() => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          return jwtDecode<UserForTokenModel>(accessToken);
        } catch (error) {
          console.error('Failed to decode token', error);
        }
      }
      return null;
    })() as UserForTokenModel & JwtPayload | null
  }),
  actions: {
    isLoggedIn() {
      return !!this.accessToken && !!this.refreshToken;
    },

    getAccessToken() {
      if (!this.isLoggedIn()) {
        return null;
      }

      if (this.tokenData && this.tokenData.exp && this.tokenData.exp * 1000 < Date.now()) {
        this.getFreshTokens();
      }

      return this.accessToken;
    },

    updateToken({ accessToken, refreshToken }: { accessToken: string, refreshToken: string }) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      try {
        this.tokenData = jwtDecode<UserForTokenModel>(accessToken);
      } catch (error) {
        console.error('Failed to decode token', error);
        this.tokenData = null;
      }
    },
    removeToken() {
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      this.tokenData = null;
    },
    async login(credentials: { email: string, password: string }) {
      try {
        const { data } = await api.post('/api/auth/login', credentials);
        this.updateToken({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            switch (error.response.status) {
              case 401:
                useSystemMessagesStore().addMessage({ level: MessageLevel.Error, text: 'Credenciais inválidas', details: error.response.data });
                break;
              case 404:
                useSystemMessagesStore().addMessage({ level: MessageLevel.Error, text: 'Usuário não encontrado', details: error.response.data });
                break;
            }
          } else if (error instanceof Error) {
            useSystemMessagesStore().addMessage({ level: MessageLevel.Error, text: 'Erro não esperado', details: JSON.stringify(error.toJSON()) });
          }
          throw error;
        }
      }
    },
    async logout() {
      try {
        await api.post('/api/auth/logout', { refreshToken: this.refreshToken });
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 403 && error.response.data.message === 'Invalid token') {
          this.removeToken();
          return;
        }
      }

      this.removeToken();

      useSystemMessagesStore().addMessage({ level: MessageLevel.Info, text: 'Logout realizado com sucesso' });
    },
    async getFreshTokens() {
      const { data } = await api.post('/api/auth/refresh', { token: this.getFreshTokens });
      this.updateToken({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    }
  }
});
