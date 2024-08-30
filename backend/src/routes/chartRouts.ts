import { Server } from 'socket.io';
import { Router } from 'express';
import { ApiResponse } from '../utils/ApiResponse';

const chartRouts = Router();

chartRouts.route('/char-app').post((req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'stable'));
});

export { chartRouts };
