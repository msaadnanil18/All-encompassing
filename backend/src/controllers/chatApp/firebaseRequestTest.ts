import { asyncHandler } from '../../utils/asyncHandler';
import { Component } from '../../models/conmponent.medel';
import dayjs from 'dayjs';

import { firestoreDB } from '../../firebse';

const firebaseReq = asyncHandler(async (req, res) => {
  const { message } = req.body;

  try {
    const savedRequest = await Component.create({
      message,
      name: dayjs().toISOString(),
      timestamp: new Date(),
    });

    const data = {
      message,
      timestamp: new Date().toISOString(),
    };
    await firestoreDB.collection('users').add(data);

    res.status(200).send({ success: true, id: savedRequest._id });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error });
  }
});

export { firebaseReq };
