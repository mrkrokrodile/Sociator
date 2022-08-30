import UserModel from '../models/UserModel';
import { ObjectId, Types } from 'mongoose';
import { Request, Response } from 'express';

export class UserController {
	static getAllUsers = async (req: Request, res: Response) => {
		const users = await UserModel.find().select('-password');
		res.status(200).json(users);
	};

	static userInfo = async (req: Request, res: Response) => {
		console.log(req.params);
		if (!Types.ObjectId.isValid(req.params.id))
			return res.status(400).send('ID unknown : ' + req.params.id);

		UserModel.findById(req.params.id, (err, docs) => {
			if (!err) res.send(docs);
			else console.log('ID unknown :' + err);
		}).select('-password');
	};

	static updateUser = async (req: Request, res: Response) => {
		if (!Types.ObjectId.isValid(req.params.id))
			return res.status(400).send('ID unknown : ' + req.params.id);

		try {
			const docs = await UserModel.findOneAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						bio: req.body.bio,
					},
				},
				{ new: true, upsert: true, setDefaultsOnInsert: true }
			);
			return res.send(docs);
		} catch (err) {
			return res.status(500).json({ message: err });
		}
	};

	static deleteUser = async (req: Request, res: Response) => {
		if (!Types.ObjectId.isValid(req.params.id))
			return res.status(400).send('ID unknown : ' + req.params.id);

		try {
			await UserModel.deleteOne({ _id: req.params.id }).exec();
			res.status(200).json({ message: 'Successfully deleted. ' });
		} catch (err) {
			return res.status(500).send({ message: err });
		}
	};

	static follow = async (req: Request, res: Response) => {
		if (
			!Types.ObjectId.isValid(req.params.id) ||
			!Types.ObjectId.isValid(req.body.idToFollow)
		)
			return res.status(400).send('ID unknown : ' + req.params.id);

		if (req.params.id === req.body.idToFollow) {
			return res
				.status(401)
				.send(
					"Il n'y a vraiment personne d'autre que toi qui peux te follow ?"
				);
		}

		try {
			// add to the follower list
			const following = await UserModel.findByIdAndUpdate(
				req.params.id,
				{ $addToSet: { following: req.body.idToFollow } },
				{ new: true, upert: true }
			);
			// add to following list
			await UserModel.findByIdAndUpdate(
				req.body.idToFollow,
				{ $addToSet: { followers: req.params.id } },
				{ new: true, upert: true }
			);
			return res.send(following);
		} catch (err) {
			return res.status(500).send({ message: err });
		}
	};

	static unfollow = async (req: Request, res: Response) => {
		if (
			!Types.ObjectId.isValid(req.params.id) ||
			!Types.ObjectId.isValid(req.body.idToUnFollow)
		)
			return res.status(400).send('ID unknown : ' + req.params.id);

		try {
			// add to the follower list
			const unfollow = await UserModel.findByIdAndUpdate(
				req.params.id,
				{ $pull: { following: req.body.idToUnFollow } },
				{ new: true, upert: true }
			);
			// add to following list
			await UserModel.findByIdAndUpdate(
				req.body.idToUnFollow,
				{ $pull: { followers: req.params.id } },
				{ new: true, upert: true }
			);
			return res.send(unfollow);
		} catch (err) {
			return res.status(500).send({ message: err });
		}
	};
}
