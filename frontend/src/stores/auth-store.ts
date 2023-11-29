import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || null as string | null,
    refreshToken: localStorage.getItem('refresh_token') || null as string | null
  }),
  actions: {
    updateToken({accessToken, refreshToken}: {accessToken: string, refreshToken: string}) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    },
    removeToken() {
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    async login(credentials: {email: string, password: string}) {
      const {data} = await api.post('/api/auth/login', credentials);
      this.updateToken({accessToken: data.accessToken, refreshToken: data.refreshToken});
    },
    async logout() {
      await api.post('/api/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      this.removeToken();
    },
    async getFreshTokens() {
      const {data} = await api.post('/api/auth/refresh', {token: this.getFreshTokens});
      this.updateToken({accessToken: data.accessToken, refreshToken: data.refreshToken});
    }
  }
});
