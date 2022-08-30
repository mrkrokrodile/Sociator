import UserModel from '../models/UserModel';
import { ObjectId, Types } from 'mongoose';
import { Request, Response } from 'express';
import PostModel from '../models/PostModel';

export class PostController {
	static readPost = (req: Request, res: Response) => {
		PostModel.find((err, docs) => {
			if (!err) res.send(docs);
			else console.log('Error to get data');
		})
			.sort({ createdAt: -1 })
			.populate('posterId');
	};

	static createPost = async (req: Request, res: Response) => {
		console.log('userPOST', res.locals.user);
		const newPost = new PostModel({
			posterId: res.locals.user,
			message: req.body.message,
			video: req.body.video,
			likers: [],
			comments: [],
		});

		try {
			const post = await newPost.save();
			return res.status(201).json(post);
		} catch (err) {
			return res.status(400).send(err);
		}
	};

	static updatePost = async (req: Request, res: Response) => {
		if (!Types.ObjectId.isValid(req.params.id))
			return res.status(400).send('ID unknown : ' + req.params.id);

		const updateRecord = {
			message: req.body.message,
		};

		PostModel.findByIdAndUpdate(
			req.params.id,
			{ $set: updateRecord },
			{ new: true },
			(err, docs) => {
				if (!err) res.send(docs);
				else console.log('Update error : ' + err);
			}
		);
	};

	static deletePost = async (req: Request, res: Response) => {
		if (!Types.ObjectId.isValid(req.params.id))
			return res.status(400).send('ID unknown : ' + req.params.id);

		PostModel.findByIdAndDelete(req.params.id, (err, docs) => {
			if (!err) res.send(docs);
			else console.log('Delete error : ' + err);
		});
	};

	static likePost = async (req: Request, res: Response) => {
		if (!Types.ObjectId.isValid(req.params.id))
			return res.status(400).send('ID unknown : ' + req.params.id);

		try {
			const likecommenter = await PostModel.findByIdAndUpdate(
				req.params.id,
				{
					$addToSet: { likers: req.body.id },
				},
				{ new: true }
			);
			const likepost = await UserModel.findByIdAndUpdate(
				req.body.id,
				{
					$addToSet: { likes: req.params.id },
				},
				{ new: true }
			);
			res.send({ likecommenter, likepost });
		} catch (err) {
			return res.status(400).send(err);
		}
	};

	static unlikePost = async (req: Request, res: Response) => {
		if (!Types.ObjectId.isValid(req.params.id))
			return res.status(400).send('ID unknown : ' + req.params.id);

		try {
			const unlikecommenter = await PostModel.findByIdAndUpdate(
				req.params.id,
				{
					$pull: { likers: req.body.id },
				},
				{ new: true }
			);
			const unlikepost = await UserModel.findByIdAndUpdate(
				req.body.id,
				{
					$pull: { likes: req.params.id },
				},
				{ new: true }
			);
			res.send({ unlikepost, unlikecommenter });
		} catch (err) {
			return res.status(400).send(err);
		}
	};

	static commentPost = async (req: Request, res: Response) => {
		if (!Types.ObjectId.isValid(req.params.id))
			return res.status(400).send('ID unknown : ' + req.params.id);

		try {
			const comment = await PostModel.findByIdAndUpdate(
				req.params.id,
				{
					$push: {
						comments: {
							commenterId: req.body.commenterId,
							commenterPseudo: req.body.commenterPseudo,
							text: req.body.text,
							timestamp: new Date().getTime(),
						},
					},
				},
				{ new: true }
			);
			res.send(comment);
		} catch (err) {
			return res.status(400).send(err);
		}
	};

	static editCommentPost = async (req: Request, res: Response) => {
		if (!Types.ObjectId.isValid(req.params.id))
			return res.status(400).send('ID unknown : ' + req.params.id);

		try {
			const editcomment = await PostModel.findById(req.params.id);
			// (err, docs) => {
			//   const theComment = docs.comments.find((comment) =>
			//     comment._id.equals(req.body.commentId)
			//   );

			//   if (!theComment) return res.status(404).send("Comment not found");
			//   theComment.text = req.body.text;

			//   return docs.save((err) => {
			//     if (!err) return res.status(200).send(docs);
			//     return res.status(500).send(err);
			//   });
			// });
			const theComment = editcomment.comments.find((comment) =>
				comment._id.equals(req.body.commentId)
			);

			if (!theComment) return res.status(404).send('Comment not found');
			theComment.text = req.body.text;

			const result = await editcomment.save();
			res.send(result);
		} catch (err) {
			return res.status(400).send(err);
		}
	};

	static deleteCommentPost = async (req: Request, res: Response) => {
		if (!Types.ObjectId.isValid(req.params.id))
			return res.status(400).send('ID unknown : ' + req.params.id);

		try {
			const deletecomment = await PostModel.findByIdAndUpdate(
				req.params.id,
				{
					$pull: {
						comments: {
							_id: req.body.commentId,
						},
					},
				},
				{ new: true }
			);
			res.send(deletecomment);
		} catch (err) {
			return res.status(400).send(err);
		}
	};
}
