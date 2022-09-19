import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';

export const checkUser = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies['access_token'];
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
			if (err) {
				res.locals.user = null;
				res.cookie('access_token', '', { maxAge: 1 });
				next();
			} else {
				let user = await UserModel.findById(decodedToken.id);
				console.log('user', user);
				res.locals.user = user;
				next();
			}
		});
	} else {
		console.log('bad (error with checkUser)');
		res.locals.user = null;
		// next();
	}
};

export const requireAuth = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies['access_token'];
	console.log(req.cookies['access_token']);
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
			if (err) {
				console.log(err);
			} else {
				console.log(decodedToken.id);
				next();
			}
		});
	} else {
		console.log('no token');
	}
};
