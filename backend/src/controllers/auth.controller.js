import { generateToken } from "../lib/utils.js";
import User from "../modles/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({error: "All fields are required"});
        }

        if(password.length < 6) {
            return res.status(400).json({error: "Password must be at least 6 characters long"});
        }

        const user = await User.findOne({email})

        if(user) {
            return res.status(400).json({error: "Email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({fullName, email, password: hashedPassword});

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        }else {
            res.status(400).json({error: "Invalid user data"});
        }

    }catch(error) {
        res.status(500).json({error: "Server error"});

    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({error: "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({error: "Invalid credentials"});
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
        
    } catch (error) {
        console.log("error in login route", error.message);
        res.status(500).json({error: "Server error"});
        
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({message: "Logout successful"});
        
    } catch (error) {
        console.log("error in logout route", error.message);
        res.status(500).json({error: "Server error"});
        
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({error: "Profile picture is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "profile_pictures"
        })


        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

        res.status(200).json({
            updatedUser,
            message: "Profile updated successfully"
            
        });



        
    } catch (error) {
        console.log("error in update profile route", error.message);
        res.status(500).json({error: "Server error"});
        
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
        
    } catch (error) {
        console.log("error in checkAuth route", error.message);
        res.status(500).json({error: "Server error"});
        
    }
}
