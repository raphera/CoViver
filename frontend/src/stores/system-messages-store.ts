import { defineStore } from 'pinia';
import { Notify, QNotifyAction } from 'quasar';
import { MessageLevel, MessageModel } from '../models/MessageModel';
import { Dialog } from 'quasar';

export const useSystemMessagesStore = defineStore({
  id: 'system-messages',
  state: () => ({
    messages: [] as MessageModel[],
  }),
  actions: {
    addMessage(message: MessageModel, notify = true) {
      if (this.messages.length >= 100) {
        this.messages.shift();
      }

      this.messages.push(message);

      if (notify)
        this.notify(message);
    },
    notify(message: MessageModel) {
      const actions: QNotifyAction[] = [
        // { label: 'Fechar', color: 'white'},
      ];

      if (message.details && message.details.length > 0) {
        actions.push({
          label: 'Detalhes',
          // icon: 'info',
          color: 'white',
          handler: () => {
            Dialog.create({
              title: 'Detalhes',
              message: message.details
            });
          }
        });
      }

      Notify.create({
        color: this.getColor(message.level),
        textColor: 'white',
        icon: this.getIcon(message.level),
        message: message.text,
        actions: actions
      });
    },
    getColor(level: MessageLevel) {
      switch (level) {
        case MessageLevel.Error: return 'red-5';
        case MessageLevel.Debug: return 'grey-5';
        case MessageLevel.Info: return 'blue-5';
        case MessageLevel.Success: return 'green-4';
        case MessageLevel.Warning: return 'orange-4';
      }
    },
    getIcon(level: MessageLevel) {
      switch (level) {
        case MessageLevel.Error: return 'error';
        case MessageLevel.Debug: return 'bug_report';
        case MessageLevel.Info: return 'info';
        case MessageLevel.Success: return 'check';
        case MessageLevel.Warning: return 'warning';
      }
    }
  },
});
