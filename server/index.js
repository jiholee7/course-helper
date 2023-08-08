import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { userRouter } from './src/routes/users.js'
import 'dotenv/config.js'
import { courseRouter } from './src/routes/courses.js'
import { reviewRouter } from './src/routes/reviews.js'

const app = express()
app.use(express.json())

app.use(cors())

app.use('/auth', userRouter)
app.use('/courses', courseRouter)
app.use('/reviews', reviewRouter)







 app.get("/", (req, res) => {
   res.json("Hello")
 })

mongoose.connect(`mongodb+srv://jiholeeuf:${process.env.PASSWORD}@class-review-app.1wymdd3.mongodb.net/Class-Review-App?retryWrites=true&w=majority`)


app.listen('https://course-helper-api.vercel.app', () => console.log("SERVER STARTED!"))
