import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { v4 as randomUUID } from 'uuid'
import UserModel from "../models/UserModel";
import { loginErrors, registerErrors } from "../utils/errors.utils";

const maxAge = 3 * 24 * 60 * 60 * 1000;

export class AuthController {

    static createToken = (id) => {
        return jwt.sign({id}, process.env.JWT_SECRET, {
          expiresIn: maxAge
        })
      };

    static register = async (req: Request, res: Response) => {
        console.log(req.body)

      try {
          const user = await UserModel.create(req.body);
          res.status(201).json({user: user._id});
      } catch (err) {
          const errors = registerErrors(err)
          res.status(400).send({ errors })
      }
    }

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body
       
        const user = await UserModel.findOne({ email })
        const token = AuthController.createToken(user._id);
        res.cookie('access_token', token, { httpOnly: true, maxAge, sameSite: 'lax', secure: true})
        if(!user) { // si user est undefined ou null
            return res.status(400).send({message: 'User not found !'})
        }

        user.comparePassword(password, (error: Error, match: boolean) => {
            // si compare password renvois une error envoyer le message une erreur
            if (error) {
                const errors = loginErrors(error);
                res.status(400).json({ errors })

            }

            if (!match) {
                return res.status(400).send({ message: 'Invalid credentials'})
        
            }

            return res.send({user})
        }) 
        

}

    static logout = async (req: Request, res: Response) => {
        
        res.cookie('access_token', '', { maxAge: 1 });
        console.log(req.body)
        res.redirect('/users');
    }
}