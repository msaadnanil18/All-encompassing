import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { Chat } from '../../models/chartApp/chat.model';
import { ApiError } from '../../utils/ApiError';
import { emitEvent } from '../../utils';
import { ALERT, REFETCH_CHATS } from '../../constants/chatapp/constants';
import create from '../crudControllers/create';

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

const createChat = asyncHandler(async (req, res, next) => {
  const { body, db } = req;
  const { payload } = body;
  const receiver = await db.User.findOne({ _id: payload.receiver });

  const isChatAlreadyExite = await db.Chat.findOne({
    groupChat: false,
    members: {
      $all: [req.user._id, (payload as any)?.receiver],
    },
  });

  if (isChatAlreadyExite) {
    return res.json({ data: isChatAlreadyExite });
  }

  create(Chat, {
    payloadTransformer: async ({ user, payload }) => {
      const members = [user._id, (payload as any)?.receiver];
      return {
        members,
        name: `${user.name}-${receiver?.name}`,
      };
    },
  })(req, res, next);
});

export { newChatGroup, createChat };
