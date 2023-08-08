import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from '../models/Users.js'
import 'dotenv/config.js'

const router = express.Router()


router.post('/register', async (req, res) => {
  const { username, password } = req.body //getting username and pass from frontend

  const user = await UserModel.findOne({username: username}) //checking to see if there already is a user with that username

  if (user){ //if there is alr a user w that username, returning this message
    return res.json({message: "User already exists!"})
  }

  //otherwise make the new username
  const hashedPassword = await bcrypt.hash(password, 10) //encrypts password that user uploads
  
  const newUser = new UserModel({username: username, password: hashedPassword}) //add this data to db
  await newUser.save()

  res.json({message: "User Registered Successfully!"})
})


router.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = await UserModel.findOne({ username })

  if (!user) {
    return res.json({ message: "User Doesn't Exist!"})
  } //see if the username that is passed thru exists in db

  const isPasswordValid = await bcrypt.compare(password, user.password) //checks if the inputted password is valid. the bcrypt.compare is used since the stored password is encrypted.

  if (!isPasswordValid){
    return res.json({message: "Username or Password is Incorrect!"})
  } //if password isn't right

  const token = jwt.sign({ id: user._id }, process.env.SECRET)
  res.json({ token, userId: user._id })
})


export {router as userRouter}

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token, process.env.SECRET, (err) => {
      if (err) return res.sendStatus(403)
      next()
    })
  } else {
    res.sendStatus(401)
  }
}