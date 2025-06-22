import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { userName, email, password } = req.body;
  //after getting password from body -> hash password
  //hashsync (synchronously->immediately hash password) -> wait for hash, dont need await.
  const hashedPassword = bcryptjs.hashSync(password, 10);
  //save inside database
  const newUser = new User({ userName, email, password: hashedPassword });
  //try and catch -> send error to user in case of duplicate email and password.

  try {
    await newUser.save(); //first save then move to the next line.
    res.status(201).json("User created successfully!");
  } catch (error) {
    next(error);
  }
};

//create and export signin function
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if(!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest} = validUser._doc;
    res
    .cookie('access_token', token, { httpOnly: true})
    .status(200)
    .json(rest);
  } catch (error) {
    next(error);
  }
};

// create fundtion to handle google sign in
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if(user){
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else{
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); //generate random password
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        userName: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), //remove spaces and convert to lowercase
        email: req.body.email,
        password: hashedPassword,
        photo: req.body.photo,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);  
  }
}

//create function to google signout
export const signOut = async (req, res, next) => {
  //clear cookie
  try {
    res.clearCookie('access_token');
    res.status(200).json("User signed out successfully!");
  } catch (error) {
    next(error);
  }
}