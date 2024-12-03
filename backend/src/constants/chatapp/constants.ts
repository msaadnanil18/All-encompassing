export const ChatEventEnum = Object.freeze({
  CONNECTED_EVENT: 'connected',

  DISCONNECT_EVENT: 'disconnect',

  JOIN_CHAT_EVENT: 'joinChat',

  NEW_CHAT_EVENT: 'newChat',
  SOCKET_ERROR_EVENT: 'socketError',

  DELETE_MESSAGE_EVENT: 'deleteMessage',

  UPDATED_CHATS_LIST: 'updatedChatList',
});

export const AvailableChatEvents = Object.values(ChatEventEnum);

export const ALERT = 'ALERT';
export const REFETCH_CHATS = 'REFETCH_CHATS';
