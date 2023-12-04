<style scoped>
.account-card {
  transition: box-shadow .3s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }
}
</style>

<style lang="sass">
.grid-masonry
  flex-direction: column
  height: 700px

  &--2
    > div
      &:nth-child(2n + 1)
        order: 1
      &:nth-child(2n)
        order: 2

    &:before
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 1
  &--3
    > div
      &:nth-child(3n + 1)
        order: 1
      &:nth-child(3n + 2)
        order: 2
      &:nth-child(3n)
        order: 3

    &:before,
    &:after
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 2
</style>
<template>
  <q-page padding>
    <div class="fixed-action-button">
      <q-btn color="primary" @click="openDialog(null)" icon="add" label="Nova Conta" />
    </div>

    <q-table :rows="accounts" :columns="columns" row-key="account_id" flat hide-header hide-bottom virtual-scroll grid
      :card-container-class="cardContainerClass">

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card class="account-card">
            <q-card-section class="row items-center justify-between">
              <div class="row items-center">
                <q-avatar :icon="getAccountIcon(props.row.icon_path)" square />
                <div class="q-ml-md">
                  <div class="text-h6">{{ getTypeName(props.row.type_id) }} - {{ getCategoryName(props.row.category_id) }}
                  </div>
                  <div class="text-caption">{{ props.row.account_name }}</div>
                </div>
              </div>
              <q-btn flat round dense icon="more_vert">
                <q-menu>
                  <q-list>
                    <q-item clickable v-close-popup @click="deleteAccount(props.row)">
                      <q-item-section>Excluir</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-card-section>

            <q-card-section>
              <div class="q-mb-md">Saldo Inicial: R$ {{ props.row.initial_balance }}</div>
              <div class="q-mb-md">Receitas: R$ {{ props.row.incomes }}</div>
              <!-- ... Outros dados ... -->
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="text-right text-h6">Saldo Atual: R$ {{ props.row.current_balance }}</div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-page>

  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ editedIndex === -1 ? 'Nova Conta' : 'Editar Conta' }}</div>
      </q-card-section>

      <q-card-section>
        <q-input filled v-model="editedItem.account_name" label="Nome da Conta" />
        <q-input filled v-model="editedItem.details" label="Detalhes" />
        <q-select filled v-model="editedItem.category_id" :options="accountsStore.categories" label="Categoria"
          option-label="category_name" option-value="category_id" emit-value map-options />
        <q-select filled v-model="editedItem.type_id" :options="accountsStore.types" label="Tipo" option-label="type_name"
          option-value="type_id" emit-value map-options />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" @click="close" />
        <q-btn color="primary" label="Salvar" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { onMounted, computed } from 'vue';
import { useAccountsStore } from '../stores/accounts-store';
import { useAuthStore } from 'src/stores/auth-store';
import { useSystemMessagesStore } from 'src/stores/system-messages-store';
import { Account } from 'src/models/AccountModel';
import { MessageLevel } from 'src/models/MessageModel';
import { useQuasar } from 'quasar';

export default {
  data() {
    return {
      columns: [
        { name: 'name', required: true, label: 'Nome', align: 'left', field: 'account_name' },
        { name: 'category', label: 'Categoria', align: 'left', field: row => this.getCategoryName(row.category_id) },
        { name: 'type', label: 'Tipo', align: 'left', field: row => this.getTypeName(row.type_id) },
        { name: 'details', label: 'Ações', align: 'left', field: 'actions' }
      ],
      dialog: false,
      editedIndex: -1,
      editedItem: {} as Account,
    };
  },
  setup() {
    const accountsStore = useAccountsStore();
    const authStore = useAuthStore();
    const systemMessages = useSystemMessagesStore();

    const accounts = computed(() => accountsStore.accounts);
    const accountTypes = computed(() => accountsStore.types);
    const accountCategories = computed(() => accountsStore.categories);

    const quasar = useQuasar();

    onMounted(async () => {
      await accountsStore.fetchAccountCategories();
      await accountsStore.fetchAccountTypes();
      if (authStore.tokenData)
        await accountsStore.fetchAccounts(authStore.tokenData.user_id);
      else {
        systemMessages.addMessage({
          level: MessageLevel.Error,
          text: 'Não foi possível carregar as contas.',
          details: 'Há algum problema com a autenticação. Por favor, tente deslogar e logar do sistema.'
        });
      }
    });

    return {
      accountsStore,

      accounts,
      accountTypes,
      accountCategories,

      cardContainerClass: computed(() => {
        return quasar.screen.gt.xs
          ? 'grid-masonry grid-masonry--' + (quasar.screen.gt.sm ? '3' : '2')
          : null
      }),
    };
  },

  methods: {
    openDialog(item: Account | null) {
      if (item) {
        this.editedIndex = this.accounts.indexOf(item);
        this.editedItem = Object.assign({}, item);
      } else {
        this.editedIndex = -1;
        this.editedItem = {} as Account;
      }
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },

    async save() {
      if (this.editedIndex === -1) {
        await this.accountsStore.createAccount(this.editedItem);
      } else {
        await this.accountsStore.updateAccount(this.editedItem);
      }
      close();
    },
    getCategoryName(categoryId: number) {
      const category = this.accountCategories.find(c => c.category_id === categoryId);
      return category ? category.category_name : '';
    },
    getTypeName(typeId: number) {
      const type = this.accountTypes.find(t => t.type_id === typeId);
      return type ? type.type_name : '';
    },
    getAccountIcon(iconPath: string | null) {
      return iconPath || 'account_balance_wallet'; // Substitua 'default-icon.svg' pelo caminho do seu ícone padrão
    },
    deleteAccount(account: Account) {
      this.accountsStore.deleteAccount(account.account_id);
    }
  }
};
</script>
