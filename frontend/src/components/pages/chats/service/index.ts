import Service from '../../../../helpers/service';

export const ChatListService = Service('/api/chat-app/chat-list');

export const ArchivedChatService = Service('/api/chat-app/archive-chat');
export const UnArchivedChatService = Service('/api/chat-app/unarchive-chat');
