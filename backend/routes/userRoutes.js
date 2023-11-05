import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import { generateToken, isAdmin, isAuth } from '../utils.js';

const userRouter = express.Router();

userRouter.get(
	'/',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const users = await User.find({});
		if (users) {
			res.send(users);
		} else {
			res.status(404).send({ message: 'No Users Found' });
		}
	})
);
userRouter.get(
	'/:id',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const user = await User.findById(req.params.id);
		if (user) {
			res.send(user);
		} else {
			res.status(404).send({ message: 'No User Found' });
		}
	})
);
userRouter.post(
	'/signin',
	expressAsyncHandler(async (req, res) => {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			if (bcrypt.compareSync(req.body.password, user.password)) {
				res.send({
					_id: user._id,
					name: user.name,
					email: user.email,
					IsAdmin: user.IsAdmin,
					token: generateToken(user),
				});
				return;
			}
		}
		res.status(401).send({ message: 'Invalid Email or Password' });
	})
);
userRouter.post(
	'/signup',
	expressAsyncHandler(async (req, res) => {
		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password),
		});
		const user = await newUser.save();
		res.send({
			_id: user._id,
			name: user.name,
			email: user.email,
			IsAdmin: user.IsAdmin,
			token: generateToken(user),
		});
	})
);
userRouter.post(
	'/profile',
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const user = await User.findById(req.user._id);
		if (user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;
			if (req.body.password) {
				user.password = bcrypt.hashSync(req.body.password, 8);
			}
			const userUpdate = await user.save();
			res.send({
				_id: userUpdate._id,
				name: userUpdate.name,
				email: userUpdate.email,
				isAdmin: userUpdate.isAdmin,
				token: generateToken(userUpdate),
			});
		} else {
			res.status(404).send({ message: 'No such user found' });
		}
	})
);
userRouter.put(
	'/:id',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const user = await User.findById(req.params.id);
		if (user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;
			user.IsAdmin = Boolean(req.body.isAdmin);
			const updateuser = await user.save();
			res.send({ message: 'User Updated', user: updateuser });
		} else {
			res.status(404).send({ message: 'No User Found' });
		}
	})
);
userRouter.delete(
	'/:id',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const user = await User.findById(req.params.id);
		if (user) {
			if (user.IsAdmin === true) {
				res.status(400).send({ message: 'Can Not Delete Admin User' });
				return;
			}
			await user.deleteOne();
			res.send({ message: 'User Deleted' });
		} else {
			res.status(404).send({ message: 'No User Found' });
		}
	})
);
export default userRouter;
