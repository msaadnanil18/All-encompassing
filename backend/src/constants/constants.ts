export const ChatEventEnum = Object.freeze({
  CONNECTED_EVENT: 'connected',

  DISCONNECT_EVENT: 'disconnect',

  JOIN_CHAT_EVENT: 'joinChat',

  NEW_CHAT_EVENT: 'newChat',

  SOCKET_ERROR_EVENT: 'socketError',
});

export const AvailableChatEvents = Object.values(ChatEventEnum);
