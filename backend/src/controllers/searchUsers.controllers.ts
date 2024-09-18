import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

const searchUser = asyncHandler(async (req, res) => {
  const { query } = req.body;
  let { name } = query;
  if (typeof name !== 'string' || !name.trim()) {
    const usersList = await req.db.User.find().limit(10).select('-themConfig');
    res.json(new ApiResponse(200, usersList));
  }

  const usersList = await req.db.User.find({ name: { $regex: name } }).select(
    '-themConfig'
  );

  res.json(new ApiResponse(200, usersList, ''));
});

export { searchUser };
