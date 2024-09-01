import { charMessageService } from '../services/chart';
export const sendMessage = async (
  chatId: string | any,
  content: string,
  attachments: string[]
) => {
  const formData = { content: content, attachments: attachments };

  return await charMessageService({
    data: {
      payload: { ...formData },
      query: { id: chatId },
    },
  });
};
