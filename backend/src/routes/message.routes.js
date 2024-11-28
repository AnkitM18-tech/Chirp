import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getUserMessages,
  getUsersListSidebar,
  sendMessage,
} from "../controllers/message.controllers.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersListSidebar);
router.get("/:id", protectRoute, getUserMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
