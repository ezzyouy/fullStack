import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import User from '../models/UserModel.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils.js'

const userRouter = express.Router()

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          IsAdmin: user.IsAdmin,
          token: generateToken(user)
        })
        return
      }
    }
    res.status(401).send('Invalid Email or Password')
  })
)

export default userRouter
