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

const deleteBoard = async (req: Request, res: Response) => {
  try {

    if(req.params.boardId) {
      
      const board = await BoardModel.exists({_id: req.params.boardId })

      if (board) {
        await BoardModel.deleteOne({ _id: req.params.boardId })
        
        return res.status(201).json({
          message: "Board deleted successfully!",
          ok: true
        })
      }

      return res.status(404).json({
        message: "Board not found!",
        ok: false
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
      message: "An error occured",
      ok: false
    })
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const { boardId, columnIdx, taskIdx } = req.params
    if(!boardId || !columnIdx || !taskIdx ) return res.status(403).json({
      message: "Task not found!",
      ok: false
    });

    const board: any = await BoardModel.findOne({ _id: req.params.boardId })

    if (!board) return res.status(403).json({
      message: "Board not found!",
      ok: false
    });

    board.columns[columnIdx].tasks.splice(taskIdx, 1);

    board.save();    

    return res.status(200).json({
      message: "Task deleted!",
      ok: true
    });
  } catch (error) {
    return res.status(500).json({
      error,
      message: "An error occured",
      ok: false
    })
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
    return res.status(500).json({
      message: "An error occured",
      ok: false,
      error: error
    })
  }
};

const updateBoard = async (req: Request, res: Response) => {
  try {

    if(req.params.boardId && req.body.board) {
      
      const boardToDelete: any = await BoardModel.findOne({ _id: req.params.boardId });

      if(boardToDelete) {

        await BoardModel.deleteOne({ _id: req.params.boardId });

        const board = await new BoardModel(req.body.board).save();

        if (!board) {
          boardToDelete.save();
          return res.status(404).json({
            /* board, */
            message: "Board Not Found!",
            ok: false
          })
        }

          return res.status(201).json({
            board,
            message: "Board Updated!",
            ok: true
          })
      } 
      boardToDelete.save();
      return res.status(404).json({
        /* board, */
        message: "Board Not Found!",
        ok: false
      })
      
    }
  } catch (error) {
    return res.status(500).json({
      error,
      message: "An error occured",
      ok: false
    })
  }
  
}
const updateTask = async (req: Request, res: Response) => {
  try {
    const { boardId, columnIdx, taskIdx } = req.params
    if(!boardId || !columnIdx || !taskIdx ) return res.status(400).json({
      message: "Task not found!",
      ok: false
    });

    const board: any = await BoardModel.findOne({ _id: req.params.boardId })

    if (!board) return res.status(404).json({
      message: "Board not found!",
      ok: false
    });

    if(!req.body.task) return res.status(400).json({
      message: "The request body Task is missing!",
      ok: false
    });

    board.columns[req.body.oldColumnIndex].tasks.splice(taskIdx, 1);

    board.columns[columnIdx].tasks.splice(taskIdx, 0, req.body.task);
    
    board.save();    

    return res.status(200).json({
      message: "Task Updated!",
      ok: true
    });
  } catch (error) {
    return res.status(500).json({
      error,
      message: "An error occured",
      ok: false
    })
  }
};

export default {
  postBoard,
  getBoards,
  updateBoard,
  deleteBoard,
  deleteTask,
  updateTask
};