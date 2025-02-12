import User from "../modles/user.model.js";
import Message from "../modles/message.model.js";


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
        
    } catch (error) {
        console.log("error in getUsersForSidebar route", error.message);
        res.status(500).json({error: "Server error"});
        
    }
};


export const getMessages = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const message = await Message.find({
            $or: [
                {sender: myId, receiver: userToChatId},
                {sender: userToChatId, receiver: myId},
            ],
        }).sort({createdAt: 1});

        res.status(200).json(message);
        
    } catch (error) {
        console.log("error in getMessages route", error.message);
        res.status(500).json({error: "Server error"});
        
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id:receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();


        res.status(200).json(newMessage);

        
    } catch (error) {
        console.log("error in sendMessage route", error.message);
        res.status(500).json({error: "Server error"});

        
    }
};