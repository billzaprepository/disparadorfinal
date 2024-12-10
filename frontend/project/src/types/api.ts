export interface InstanceConfig {
  instanceName: string;
  token?: string;
  number?: string;
  qrcode: boolean;
  integration: string;
  reject_call?: boolean;
  msgCall?: string;
  groupsIgnore?: boolean;
  alwaysOnline?: boolean;
  readMessages?: boolean;
  readStatus?: boolean;
  syncFullHistory?: boolean;
  proxyHost?: string;
  proxyPort?: string;
  proxyProtocol?: string;
  proxyUsername?: string;
  proxyPassword?: string;
  webhookUrl?: string;
  webhookByEvents?: boolean;
  webhookBase64?: boolean;
  webhookEvents?: string[];
  rabbitmqEnabled?: boolean;
  rabbitmqEvents?: string[];
  sqsEnabled?: boolean;
  sqsEvents?: string[];
  chatwootAccountId?: number;
  chatwootToken?: string;
  chatwootUrl?: string;
  chatwootSignMsg?: boolean;
  chatwootReopenConversation?: boolean;
  chatwootConversationPending?: boolean;
  chatwootImportContacts?: boolean;
  chatwootNameInbox?: string;
  chatwootMergeBrazilContacts?: boolean;
  chatwootDaysLimitImportMessages?: number;
  chatwootOrganization?: string;
  chatwootLogo?: string;
  typebotUrl?: string;
  typebot?: string;
  typebotExpire?: number;
  typebotKeywordFinish?: string;
  typebotDelayMessage?: number;
  typebotUnknownMessage?: string;
  typebotListeningFromMe?: boolean;
}