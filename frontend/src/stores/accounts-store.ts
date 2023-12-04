import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';
import { Account, AccountCategory, AccountType } from 'src/models/AccountModel';
import { useAuthStore } from './auth-store';
import { useSystemMessagesStore } from './system-messages-store';
import { MessageLevel } from 'src/models/MessageModel';

export const useAccountsStore = defineStore({
  id: 'accounts',
  state: () => ({
    accounts: [] as Account[],
    categories: [] as AccountCategory[],
    types: [] as AccountType[],
  }),
  actions: {
    async fetchAccounts(userId: number) {
      try {
        const response = await axios.get(`/api/user/${userId}/accounts`, {
          headers: {
            authorization: `Bearer ${useAuthStore().getAccessToken()}`,
          },
        });
        this.accounts = response.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    async fetchAccountTypes() {
      try {
        const response = await axios.get('/api/account/types', {
          headers: {
            authorization: `Bearer ${useAuthStore().getAccessToken()}`,
          },
        });
        this.types = response.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    async fetchAccountCategories() {
      try {
        const response = await axios.get('/api/account/categories', {
          headers: {
            authorization: `Bearer ${useAuthStore().getAccessToken()}`,
          },
        });
        this.categories = response.data;
      } catch (error) {
        this.handleError(error);
      }
    },

    async createAccount(account: Account) {
      try {
        const response = await axios.post('/api/account', account, {
          headers: {
            authorization: `Bearer ${useAuthStore().getAccessToken()}`,
          },
        });
        this.accounts.push(account);
      } catch (error) {
        this.handleError(error);
      }
    },

    async updateAccount(account: Account) {
      try {
        const response = await axios.put('/api/account', account, {
          headers: {
            authorization: `Bearer ${useAuthStore().getAccessToken()}`,
          },
        });
        const index = this.accounts.findIndex(a => a.account_id === account.account_id);
        if (index !== -1) {
          this.accounts[index] = response.data;
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    async deleteAccount(accountId: number, newAccountId?: number) {
      try {
        await axios.delete('/api/account', {
          headers: {
            authorization: `Bearer ${useAuthStore().getAccessToken()}`,
          },
          data: {
            account_id: accountId,
            new_account_id: newAccountId,
          },
        });
        const index = this.accounts.findIndex(a => a.account_id === accountId);
        if (index !== -1) {
          this.accounts.splice(index, 1);
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    handleError(error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              useSystemMessagesStore().addMessage({ level: MessageLevel.Error, text: 'Credenciais inválidas', details: error.response.data });
              break;
            case 404:
              useSystemMessagesStore().addMessage({ level: MessageLevel.Error, text: 'Conta não encontrada', details: error.response.data });
              break;
            case 403:
              useSystemMessagesStore().addMessage({ level: MessageLevel.Error, text: 'Acesso proibido', details: error.response.data });
              break;
            case 500:
              useSystemMessagesStore().addMessage({ level: MessageLevel.Error, text: 'Erro interno do servidor', details: error.response.data });
              break;
            default:
              useSystemMessagesStore().addMessage({ level: MessageLevel.Error, text: 'Erro desconhecido', details: error.response.data });
          }
        } else if (error.request) {
          useSystemMessagesStore().addMessage({ level: MessageLevel.Error, text: 'Erro de conexão com o servidor', details: JSON.stringify(error.toJSON()) });
        } else {
          useSystemMessagesStore().addMessage({ level: MessageLevel.Error, text: 'Erro não esperado', details: JSON.stringify(error.toJSON()) });
        }
        throw error;
      }
    }
  },
});
