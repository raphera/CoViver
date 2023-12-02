import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { jwtDecode } from 'jwt-decode';
import { UserForTokenModel } from './../../../backend/src/models/UserForTokenModel'
import { AxiosError } from 'axios';

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
    })() as UserForTokenModel | null
  }),
  actions: {
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
      const { data } = await api.post('/api/auth/login', credentials);
      this.updateToken({ accessToken: data.accessToken, refreshToken: data.refreshToken });
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
    },
    async getFreshTokens() {
      const { data } = await api.post('/api/auth/refresh', { token: this.getFreshTokens });
      this.updateToken({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    }
  }
});
