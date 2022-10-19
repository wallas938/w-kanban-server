import mongoose, { Schema } from "mongoose";
const BoardModel = mongoose.model(
  "Board",
  new Schema({
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    columns: {
      required: true,
      type: [
        {
          id: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          color: {
            type: String,
            required: false,
          },
          tasks: {
            required: false,
            type: [
              {
                id: {
                  type: String,
                  required: true,
                },
                title: {
                  type: String,
                  required: true,
                },
                description: {
                  type: String,
                  required: true,
                },
                status: {
                  type: String,
                  required: false,
                },
                columnId: {
                  type: String,
                  required: true,
                },
                subtasks: {
                  required: false,
                  type: [
                    {
                      id: {
                        type: String,
                        required: true,
                      },
                      title: {
                        type: String,
                        required: true,
                      },
                      isCompleted: {
                        type: Boolean,
                        required: true,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }
  )
);

export default BoardModel;
