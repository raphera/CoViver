export enum MessageLevel {
  Error = 'error',
  Debug = 'debug',
  Info = 'info',
  Success = 'success',
  Warning = 'warning'
}

export interface MessageModel {
  level: MessageLevel;
  text: string;
  details?: string;
}
