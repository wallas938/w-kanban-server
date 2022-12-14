import express from "express";
import userController from "~/controllers/user.controller";

const router = express.Router();

router.get("/", userController.getUser);

router.post("/signup", userController.signup);

router.post("/signin", userController.signin);

export default router;
