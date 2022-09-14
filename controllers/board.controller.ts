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

const getBoards = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  try {
    if(userId) {
      const boards = await BoardModel.find({ userId: userId})
      
      return res.status(200).json({
        message: "user boards was retreived with success!",
        ok: true,
        boards: boards
      })
   }
  } catch (error) {
    return res.status(200).json({
      message: "An error occured",
      ok: false,
      error: error
    })
  }
}

export default {
  postBoard,
  getBoards
};
