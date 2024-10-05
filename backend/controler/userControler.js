import {catchAsynceError} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import {User} from "../models/userSchema.js";
import {v2 as cloudinary} from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";

export const register = catchAsynceError(async(req, res, next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Avatar And Resume are Required", 400))
    }

    const {avatar} = req.files;

    // console.log("AVATARavatar", avatar);

    const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {folder: "AVATARS"}
    
    );
    if(!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error){
        console.log(
            "Cloudinary Error:", 
            cloudinaryResponseForAvatar.error || "Unknown Cloudinary Error"
        );
    };

    const {resume} = req.files;

    // console.log("MY_RESUME", resume);

    const cloudinaryResponseForResume = await cloudinary.uploader.upload(
        resume.tempFilePath,
        {folder: "MY_RESUME"}
    
    );
    if(!cloudinaryResponseForResume || cloudinaryResponseForResume.error){
        console.log(
            "Cloudinary Error:", 
            cloudinaryResponseForResume.error || "Unknown Cloudinary Error"
        );
    };



    const {
        fullName, 
        email, 
        phone, 
        aboutMe, 
        password, 
        portfolioURL, 
        githubURL, 
        leetcodeURL, 
        linkedInURL, 
        twitterURL,
    } = req.body;

    const user = await User.create({
        fullName,
        email, 
        phone, 
        aboutMe, 
        password, 
        portfolioURL, 
        githubURL, 
        leetcodeURL, 
        linkedInURL, 
        twitterURL,
        avatar:{
            public_id: cloudinaryResponseForAvatar.public_id,
            url: cloudinaryResponseForAvatar.secure_url,
        },
        resume:{
            public_id: cloudinaryResponseForResume.public_id,
            url: cloudinaryResponseForResume.secure_url,
        },
    });

    // res.status(200).json({
    //     success: true,
    //     message: "User Registered",
    // });

    generateToken(user, "User Registered", 201, res);
});


export const login = catchAsynceError(async(req, res, next)=>{
    const {email, password}  = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Email And Password Are Required", 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email Or Password",404));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email Or Password",401));
    }
    generateToken(user, "Logged In Successfully", 200, res);
});