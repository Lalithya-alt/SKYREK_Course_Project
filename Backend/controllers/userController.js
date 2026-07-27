import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import OTP from "../models/otp.js";
import nodemailer from "nodemailer"; 

dotenv.config();

const transporter = nodemailer.createTransport({
    service : "gmail",
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth : {
        user : process.env.EMAIL,
        pass : process.env.APP_PASSWORD
    }
})

export async function createUser(req, res) {
    try {
        //find already has user with the same email
        const user = await User.find({email: req.body.email})

        if(user != null && user.length > 0) {
            return res.json({ message: "User with the same email already exists" })
            
        }

        //create user
        //const newUser = new User(req.body)  // less secure way to create user, because it allows users to set isAdmin, isBlocked, isEmailVerified and image fields by themselves

        const passwordHash = await bcrypt.hash(req.body.password, 10)   //10 -->salting round (it mean 10 time hashing the password with different salt)
        console.log("Password hash: ", passwordHash);

        const newUser = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: passwordHash
        });

        await newUser.save()

        res.json({ message: "User created successfully" })


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function loginUser(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

       if(email == null || password == null) {
        return res.status(400).json({ message: "Email and password are required" });
       }

       const user = await User.findOne({ email: email });

       if(user == null) {
        return res.status(400).json({ message: "User not found" });
       }

    const isPasswordValid = await bcrypt.compare(password, user.password); 

    if(isPasswordValid) {
            const token = jwt.sign(
                { email: user.email, 
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin ,
                isBlocked: user.isBlocked,
                isEmailVerified: user.isEmailVerified,
                image: user.image
                },
                process.env.JWT_SECRET,{
                    expiresIn: "7d"
                }
            );

      return res.json({ message: "Login successful", token: token, isAdmin: user.isAdmin });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });

    }



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getUser(req,res) {
    if(req.user == null){
        return res.status(401).json({message: "Unauthorized"});
    }
    
    
    try {
        const email = req.user.email
        const user = await User.findOne({ email: req.user.email});

        if(user == null) {
            return res.status(404).json({ message: "User not found" });
        }   
        if(user.isBlocked){
            return res.status(403).json({message: "User is Blocked"});
        }


        res.json({email: user.email ,firstName: user.firstName, lastName:user.lastName, isAdmin:user.isAdmin, isBlocked:user.isBlocked,isEmailVerified:user.isEmailVerified,image:user.image })

        
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}

export async function updatePassword(req,res) {
    
    if(req.user == null){
        res.status(401).json({message:"Unauthorized"})
        return
    }

    const password = req.body.password;

    try{
        const passwordHash = await bcrypt.hash(password, 10);
        const email = req.user.email;
        await User.updateOne({email : email} ,{password : passwordHash} );
        res.json({ message : "Password Update Successfully" });

    }catch(error){
        res.json({message : error.message});
    }
}

export async function updateProfile(req,res) {

     if(req.user == null){
        res.status(401).json({message:"Unauthorized"})
        return
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: req.user.email },
            { 
                firstName: req.body.firstName, 
                lastName: req.body.lastName, 
                image: req.body.image 
            },
            { new: true }
        );

        if (updatedUser == null) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile Update Successfully",
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            isAdmin: updatedUser.isAdmin,
            isBlocked: updatedUser.isBlocked,
            isEmailVerified: updatedUser.isEmailVerified,
            image: updatedUser.image
        });

    } catch (error) {
         res.json({message : error.message});
    }
}

export async function googleLogin(req, res) {
    try {
        const { email, firstName, lastName, image } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        let user = await User.findOne({ email });
        if (user == null) {
            const passwordHash = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
            user = new User({
                email,
                firstName: firstName || "Google User",
                lastName: lastName || "",
                password: passwordHash,
                image: image || "",
                isEmailVerified: true
            });
            await user.save();
        } else if (!user.image && image) {
            user.image = image;
            await user.save();
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "User is blocked" });
        }

        const token = jwt.sign(
            { 
                email: user.email, 
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin,
                isBlocked: user.isBlocked,
                isEmailVerified: user.isEmailVerified,
                image: user.image
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({ message: "Login successful", token: token, isAdmin: user.isAdmin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export async function sendOTP(req, res) {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });

        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "User is blocked" });
        }

        await OTP.deleteOne({ email: email });

        // otp between 100000 and 999999
        const otpNumber = Math.floor(100000 + Math.random() * 900000);

        // save otp in database (using OTP collection since User model doesn't store OTP fields)
        const otpHash = await bcrypt.hash(otpNumber.toString(), 10);

        const newOTP = new OTP({
            email: email,
            otp: otpHash
        });
        await newOTP.save();

        // TODO: Send email with OTP
       const message = {
        from : process.env.EMAIL,
        to : email,
        subject : "SKYREK OTP for Password Reset",
        text : `Your OTP for password reset is : ${otpNumber}`,
       }
       try {
           await transporter.sendMail(message);
        } catch (error) {
           console.error(error);
        }

        return res.json({ message: "OTP sent successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function resetPassword(req, res) {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the OTP document in the database
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({ message: "OTP has expired or is invalid" });
        }

        // Compare the provided OTP with the hashed OTP in database
        const isOtpValid = await bcrypt.compare(otp.toString(), otpRecord.otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Find user and update password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        user.password = passwordHash;
        await user.save();

        // Delete the used OTP
        await OTP.deleteOne({ email });

        return res.json({ message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getAllUsers(req, res) {
    if (req.user == null || req.user.isAdmin !== true) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const pageSizeInString = req.query.pageSize || "10";
        const pageNumberInString = req.query.pageNumber || "1";
        const pageSize = parseInt(pageSizeInString) || 10;
        const pageNumber = parseInt(pageNumberInString) || 1;

        const userCount = await User.countDocuments();
        const totalPages = Math.ceil(userCount / pageSize);

        const users = await User.find()
            .sort({ _id: -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();
       
        res.status(200).json({
            totalPages: totalPages,
            currentPage: pageNumber,
            totalUsers: userCount,
            users: users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}