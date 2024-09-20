import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

const searchUser = asyncHandler(async (req, res) => {
  const { query } = req.body;
  const { name } = query;

  if (typeof name !== 'string' || !name.trim()) {
    const usersList = (
      await req.db.User.find().limit(10).select('-themConfig')
    ).filter(
      (user) => String(user._id) !== String(req.user._id) && user.isVerified
    );

    return res.json(new ApiResponse(200, usersList));
  }

  const usersList = await req.db.User.find({
    name: { $regex: name, $options: 'i' },
    _id: { $ne: req.user._id },
    isVerified: { $ne: false },
  }).select('-themConfig');

  return res.json(new ApiResponse(200, usersList));
});

export { searchUser };
