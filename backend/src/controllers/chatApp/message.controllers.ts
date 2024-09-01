import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

const sendMessage = asyncHandler(async (req, res) => {
  console.log(req.body, 'message');

  res.status(200).json(new ApiResponse(200, {}, 'stable'));
});

export { sendMessage };
