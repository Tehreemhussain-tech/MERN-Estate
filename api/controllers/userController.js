import bcryptjs from "bcryptjs";
import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res)=>{
    res.json({
        message: 'Hello friend!',
    });
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(403, "You can only update your own account!"));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
            
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set: {
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                photo: req.body.photo,
            }
        }, {new: true});

        const {password, ...rest} = updatedUser._doc;

        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
}

// create delete function
export const deleteUser = async(req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only delete your own account!"));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("access_token");
        res.status(200).json("User has been deleted successfully!");
    } catch (error) {
        next(error);
    }
}