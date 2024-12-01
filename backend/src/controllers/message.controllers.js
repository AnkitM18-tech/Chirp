import Message from "../models/message.model.js";
import User from "../models/users.model.js";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../utils/socket.js";

export const getUsersListSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({
      _id: {
        $ne: loggedInUser,
      },
    }).select("-password");

    return res
      .status(200)
      .json({ message: "Users Fetched", users: filteredUsers });
  } catch (error) {
    console.log("Error in getUsersListSidebar controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    return res.status(200).json({ message: "Messages fetched", messages });
  } catch (error) {
    console.log("Error in getUserMessages controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(401).json({ message: "No message body to send" });
    }

    let imageUrl;
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image, {
        resource_type: "image",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //! real-time functionality
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      message: newMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
