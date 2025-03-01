import { asyncHandeler } from "../../utils/error/index.js";
import ChatModel from "../../DB/models/chat.model.js";

export const getChat = asyncHandeler(async (req, res, next) => {
  const { userId } = req.params;

  const chats = await ChatModel.find({
    $or: [
      { senderId: req.user.id, receiverId: userId },
      { senderId: userId, receiverId: req.user.id },
    ],
  }).populate("senderId receiverId messages.senderId", "name email");

  if (!chats.length) {
    return next(new Error("sorry i can't find any chat ", { cause: 400 }));
  }

  res.status(200).json({ msg: "Done", chats });
});
