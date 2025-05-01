const Notification = require('../models/notificationModel');
const Admin = require('../models/admindb');

let io;
const setSocketIO = (socketIO) => {
  io= socketIO;
};


const notifyAdmins = async ({ type, title, message, relatedId, onModel }) => {
  try {
    const admins = await Admin.find({ role: 'Admin' });

    await Promise.all(admins.map(async (admin) => {
      const notification = new Notification({
        recipient: admin._id,
        type,
        title,
        message,
        relatedId,
        onModel,
        read: false
      });
      
      await notification.save();

      // Emit real-time notification to admin's room
      if(io){
      io.to(`admin_${admin._id}`).emit('new-notification', {
        _id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        createdAt: notification.createdAt,
        relatedId: notification.relatedId,
        onModel: notification.onModel
      });
    }
    }));

    return true;
  } catch (error) {
    console.error('Failed to notify admins:', error);
    throw error;
  }
};

module.exports = {notifyAdmins, setSocketIO};
 