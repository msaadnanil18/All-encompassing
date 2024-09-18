import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { Chat } from '../../models/chartApp/chat.model';
import { ApiError } from '../../utils/ApiError';
import { emitEvent } from '../../utils';
import { ALERT, REFETCH_CHATS } from '../../constants/chatapp/constants';

const sendMessage = asyncHandler(async (req, res) => {
  // console.log(req.body, 'message');

  res.status(200).json(new ApiResponse(200, {}, 'stable'));
});

const newChatGroup = asyncHandler(async (req, res) => {
  const { payload } = req.body;
  const { name, members } = payload;
  if (!name || (members || []).length < 2) {
    throw new ApiError(400, 'Group chat must have at least 3 members');
  }

  const allMembers = [...members, req.user];

  try {
    const groupCreated = await Chat.create({
      name,
      groupChat: true,
      creator: req.user,
      members: allMembers,
    });
    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
    emitEvent(req, REFETCH_CHATS, members, `Welcome to ${name} group`);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          groupCreated,
          `${groupCreated.name} is created successfully`
        )
      );
  } catch (error) {
    console.error(error);
    throw new ApiError(400);
  }
});
export { sendMessage, newChatGroup };
