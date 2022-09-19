import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as randomUUID } from 'uuid';
import UserModel from '../models/UserModel';
import { loginErrors, registerErrors } from '../utils/errors.utils';

const maxAge = 3 * 24 * 60 * 60 * 1000;

export class AuthController {
	static createToken = (id) => {
		return jwt.sign({ id }, process.env.JWT_SECRET, {
			expiresIn: maxAge,
		});
	};

	static register = async (req: Request, res: Response) => {
		console.log(req.body);
		const { password, password2 } = req.body;

		try {
			if (password !== password2) {
				throw new Error("passwords doesn't match");
			}
			const user = await UserModel.create(req.body);
			res.status(201).json({ user: user._id });
		} catch (err) {
			const errors = registerErrors(err);
			res.status(400).send({ errors });
		}
	};

	static login = async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const user = await UserModel.findOne({ email });
		
		if (!user) {
			// si user est undefined ou null
			return res.status(400).send({ message: 'User not found !' });
		}
		
		const token = AuthController.createToken(user._id);
		
		user.comparePassword(password, (error: Error, match: boolean) => {
			// si compare password renvois une error envoyer le message une erreur
			if (error) {
				const errors = loginErrors(error);
				res.status(400).json({ errors });
			}

			if (!match) {
				return res.status(400).send({ message: 'Invalid credentials' });
			}

			if (match) {
				res.cookie('access_token', token, {
					httpOnly: true,
					maxAge: maxAge,
					sameSite: 'lax',
					secure: true,
				});
                return res.send({ user });
			}
			
		});
	};

	static logout = async (req: Request, res: Response) => {
		res.cookie('access_token', '', { maxAge: 1 });
		// res.clearCookie('access_token', {path: '/auth/logout'});
		// res.status(200).send({ message:'cookie deleted'})
		return res.send({ message: 'log out' });
	};
}
