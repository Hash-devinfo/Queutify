import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addAccount,
  disconnectAccount,
  getAccount,
} from "../controllers/accountsController.js";

const accountRouter = express.Router();

accountRouter.get("/", protect, getAccount);
accountRouter.post("/", protect, addAccount);
accountRouter.delete("/:id", protect, disconnectAccount);

export default accountRouter;
