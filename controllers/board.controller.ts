import CryptoJS from "crypto-js";
import { Request, Response } from "express";
import BoardModel from "~/model/board.model";

const postBoard = async (req: Request, res: Response) => {
  try {
    const board = await new BoardModel(req.body.board).save();

    return res.status(201).json({
      serverMessage: "A new Board was added !",
      statusCode: 201,
      ok: true,
      board,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      ok: false,
      errorMessage: "An error occured",
      error: error,
    });
  }
};

export default {
  postBoard,
};
