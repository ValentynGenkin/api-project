import dotenv from 'dotenv';
import { verifyToken } from '../../util/verifyToken.js';
import User from '../../db/models/userModel.js';
import mongoose from 'mongoose';

dotenv.config();

export const authentication = async (req, res) => {
  try {
    const token = req.cookies?.customer_access;
    if (!token) {
      return res.status(403).json({
        success: false,
        msg: 'Token not provided',
      });
    }

    const id = await verifyToken(token);

    if (!id) {
      return res.status(403).json({
        success: false,
        msg: 'Invalid or expired token',
      });
    }
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }

    const requestPath = req.url;

    if (
      requestPath === '/schema-authentication' &&
      user.schemaStructure &&
      user.schemaStructure !== ''
    ) {
      return res.status(200).json({
        success: true,
        schema: user.schemaStructure,
        schemaName: user.schemaName,
      });
    }

    if (
      requestPath === '/endpoint-authentication' &&
      user.endpointName &&
      user.endpointName !== ''
    ) {
      return res.status(200).json({
        success: true,
        endpointName: user.endpointName,
      });
    }

    if (
      requestPath === '/statistics-authentication' &&
      user.endpointName &&
      user.endpointName !== ''
    ) {
      const stat = await mongoose.connection
        .collection(`${id}`)
        .countDocuments();

      return res.status(200).json({
        success: true,
        statistics: stat,
      });
    }

    if (requestPath === '/account-authentication') {
      const data = user.toObject();
      delete data._id;
      return res.status(200).json({
        success: true,
        account: data,
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Authentication error', error);
    return res.status(500).json({
      msg: 'Internal Server Error',
      error: error.message,
    });
  }
};
