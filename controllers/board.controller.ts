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
};

const updateBoard = async (req: Request, res: Response) => {
  try {

    if(req.params.boardId && req.body.board) {
      await BoardModel.deleteOne({ _id: req.params.boardId });
    
      const board = await new BoardModel(req.body.board).save();

      return res.status(201).json({
        board,
        message: "Board updated",
        ok: true
      })
    }
    
    throw new Error("Wrong baord id or baord is missing")
    
  } catch (error) {
    return res.status(500).json({
      error,
      message: "An error occured",
      ok: false
    })
  }
  
}

export default {
  postBoard,
  getBoards,
  updateBoard
};