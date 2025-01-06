import { PipelineStage } from 'mongoose';
import { asyncHandler } from '../../utils/asyncHandler';

const fetchChatList = asyncHandler(async (req, res) => {
  try {
    const pipeLine: PipelineStage[] = [
      { $match: { members: { $in: [req.user._id] } } },
      {
        $lookup: {
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'creator',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: { path: '$creator', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Messages',
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'lastMessage',
        },
      },
      { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$archivedBy', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'archivedBy.user',
          foreignField: '_id',
          as: 'archivedBy.user',
        },
      },
      {
        $unwind: { path: '$archivedBy.user', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'status',
          localField: 'members._id',
          foreignField: 'user',
          as: 'memberStatuses',
        },
      },
      { $unwind: '$members' },
      {
        $addFields: {
          'members.status': {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$memberStatuses',
                  as: 'status',
                  cond: { $eq: ['$$status.user', '$members._id'] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          'members.themConfig': 0,
          'members.refreshToken': 0,
          'members.password': 0,
          'members.isVerified': 0,
          'creator.themConfig': 0,
          'creator.refreshToken': 0,
          'creator.password': 0,
          'creator.isVerified': 0,
          'archivedBy.themConfig': 0,
          'archivedBy.refreshToken': 0,
          'archivedBy.password': 0,
          'archivedBy.isVerified': 0,
          'archivedBy.avatar': 0,
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          groupChat: { $first: '$groupChat' },
          groupAvatar: { $first: '$groupAvatar' },
          lastMessage: { $first: '$lastMessage' },
          avatarColor: { $first: '$avatarColor' },
          archivedBy: {
            $addToSet: {
              $cond: [
                {
                  $and: [
                    { $ifNull: ['$archivedBy.user', false] },
                    { $ifNull: ['$archivedBy.archivedAt', false] },
                  ],
                },
                {
                  user: '$archivedBy.user',
                  archivedAt: '$archivedBy.archivedAt',
                },
                null,
              ],
            },
          },
          members: { $push: '$members' },
          createdBy: { $first: '$createdBy' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
        },
      },
      {
        $addFields: {
          archivedBy: {
            $filter: {
              input: '$archivedBy',
              as: 'item',
              cond: { $ne: ['$$item', null] },
            },
          },
        },
      },
      { $sort: { updatedAt: -1 } },
    ];

    const data = await req.db.Chat.aggregate(pipeLine);
    return res.status(200).json({ docs: data });
  } catch (error) {
    return res.status(401).json({ message: error });
  }
});

export { fetchChatList };
