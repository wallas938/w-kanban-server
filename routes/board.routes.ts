import express from "express";
import boardController from "~/controllers/board.controller";

const router = express.Router();

router.post("/", boardController.postBoard);
router.put("/:boardId", boardController.updateBoard);
router.delete("/:boardId", boardController.deleteBoard);
router.delete("/:boardId/columns/:columnIdx/tasks/:taskIdx", boardController.deleteTask);
router.put("/:boardId/columns/:columnIdx/tasks/:taskIdx", boardController.updateTask);
router.get("/", boardController.getBoards);

export default router;
