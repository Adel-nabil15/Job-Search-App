import { Router } from "express";
import { getChat } from "./chat.service.js";
import { Authentication } from "../../middleware/Authentcationn.js";
import { Validation } from "../../middleware/Valid.js";
import { getChatValidation } from "./chat.validtion.js";
const ChatRouter = Router();
ChatRouter.get(
  "/getchat/:userId",
  Authentication,
  Validation(getChatValidation),
  getChat
);

export default ChatRouter;
