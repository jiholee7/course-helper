import express from 'express'
import mongoose from 'mongoose';
import { ReviewModel } from '../models/Reviews.js';
import { verifyToken } from './users.js';

const router = express.Router()


router.get('/:courseName', async (req, res) => {
  try{
    const response = await ReviewModel.find({courseName: req.params.courseName}).sort({ "_id": -1 })
    res.json(response)
  } catch (error){
    res.json(error)
  }
})

router.get('/ids/:userId', async (req, res) => {
  try{
    const response = await ReviewModel.find({userOwner: req.params.userId}).sort({ "_id": -1 })
    res.json(response)
  } catch (error){
    res.json(error)
  }
})

router.post('/', verifyToken, async (req, res) => {
  const newReview = new ReviewModel(req.body)
  try{
    const response = await newReview.save()
    res.json({message: "Review Added!"})
  } catch (error){
    res.json(error)
  }
})


export {router as reviewRouter}
