import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: Number,
    required: true
  },
  enjoyability: {
    type: Number,
    required: true
  },
  usefulness: {
    type: Number,
    required: true
  },
  teacher: {
    type: String,
    required: true
  },
  recommend: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', //references the users table
    required: true
  },
})

export const ReviewModel = mongoose.model("reviews", ReviewSchema)