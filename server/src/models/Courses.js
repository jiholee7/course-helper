import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  prerequisites: [{
    type: String,
  }],
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', //references the users table
    required: true
  },
})

export const CourseModel = mongoose.model("courses", CourseSchema)