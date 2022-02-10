import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from 'jsonwebtoken'
import { validateRequest, BadRequestError, RequestValidationError } from "@uknproject/common";
import { User } from "../models/users";


const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],validateRequest,  
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    console.log('caimos aca');
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const {email, password} = req.body
    const existingUser = await User.findOne({email});

    if(existingUser){
      // email is in use
      throw new BadRequestError('email already in use')
    }
    const user = User.build({
      email,password
    })
    await user.save()
    // generate the jwt
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!
    )

    req.session = {
      jwt: userJwt
    }
    // store in session object (the cookie???)
    res.status(201).send(user)

  }
);

export { router as signupRouter };
