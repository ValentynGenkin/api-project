import mongoose from 'mongoose';
import { APIkeyControl } from '../../util/APIKeyControl.js';
import { verifyToken } from '../../util/verifyToken.js';
import { requestValidation } from '../../util/requestValidation.js';
import { importModuleFromBlob } from '../../azureStorage/importModuleFromBlob.js';

export const deleteItem = async (req, res) => {
  try {
    const apiKey = req.headers.authorization?.split(' ')[1];

    const endpoint = req.params.endpoint;

    const token = req.cookies.customer_access;

    const validation = requestValidation(token, apiKey, endpoint, res);

    if (!validation) return;

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        msg: 'Item ID is missing',
      });
    }

    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        msg: 'Invalid item ID',
      });
    }

    const userData = await APIkeyControl(apiKey);

    if (!userData.success) {
      return res.status(401).json({
        msg: userData.message,
      });
    }

    const tokenID = await verifyToken(token);

    if (!userData.user.endpointName || !userData.user.schemaName) {
      return res.status(400).json({
        msg: 'Schema and/or endpoints not created',
      });
    }

    if (
      userData.success &&
      userData.user.endpointName === endpoint &&
      tokenID === userData.user.id.toString()
    ) {
      const DBModel = await importModuleFromBlob(
        userData.user.schemaUrl,
        userData.user.id,
        userData.user.schemaName,
      );

      const idToDelete = id ? await DBModel.findByIdAndDelete(id) : null;

      return res.status(200).json(
        idToDelete
          ? {
              msg: 'Data successfully deleted',
              deletedItem: idToDelete,
            }
          : { msg: `ID ${id} not found` },
      );
    } else {
      return res.status(403).json({
        msg: 'Invalid API key',
      });
    }
  } catch (error) {
    console.error('Error fetching data');
    return res.status(500).json({
      msg: 'Internal Server Error',
    });
  }
};
