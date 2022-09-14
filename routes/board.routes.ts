import express from "express";
import boardController from "~/controllers/board.controller";

const router = express.Router();

router.post("/", boardController.postBoard);
router.get("/", boardController.getBoards);

export default router;
