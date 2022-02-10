import express, {Request, Response} from "express";
import { body } from "express-validator";
import { Password } from "../services/password";
import jwt from 'jsonwebtoken'
import { BadRequestError, validateRequest }   from '@uknproject/common';;
import { User } from "../models/users";
const router = express.Router();

router.post("/api/users/signin",
  [ body('email')
  .isEmail()
  .withMessage('Email must be valid'),
  body('password')
  .trim()
  .notEmpty()
  .withMessage('Password must be between 4 and 20 character')
], validateRequest, 
  async (req: Request, res: Response) => {
    const {email, password} = req.body
    const existingUser = await User.findOne({email})
    if(!existingUser){
      throw new BadRequestError("Invalid Credentials");      
    }
    const passwordMatch = await Password.compare(existingUser.password, password)
    if(!passwordMatch){
      throw new BadRequestError("Invalid Credentials");       
    }
     // generate the jwt
     const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!
    )

    req.session = {
      jwt: userJwt
    }
      // store in session object (the cookie???)
      res.status(200).send(existingUser)
});

export { router as signinRouter };
