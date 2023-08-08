import express from 'express'
import mongoose from 'mongoose'
import { CourseModel } from '../models/Courses.js'
import { verifyToken } from './users.js'


const router = express.Router()


router.get('/:name', async (req, res) => {
   try{
     const response = await CourseModel.find({name: req.params.name})
     res.json(response)
   } catch (error){
     res.json(error)
   }
})

router.post('/', verifyToken, async (req, res) => {
  const course = await CourseModel.findOne({name: req.body.name})
  if (course){
    return res.json({message: "Course already exists!"})
  }

  const newCourse = new CourseModel(req.body)
  try{
    const response = await newCourse.save()
    res.json({message: "Course Created!"})
  } catch (error){
    res.json(error)
  }
})


export {router as courseRouter}
