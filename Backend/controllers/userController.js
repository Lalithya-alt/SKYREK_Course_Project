import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


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

    const isPasswordValid = await bcrypt.compareSync(password, user.password); 

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

    const password = req.body.password
    const passwordHash = bcrypt.hashSync(password,10)

    try{
        const email = req.user.email
        await User.updateOne({email : email} ,{password : passwordHash} )
        res.json({ message : "Password Update Successfully" })

    }catch(error){
        res.json({message : error.meassage})
    }
}

export async function updateProfile(req,res) {

     if(req.user == null){
        res.status(401).json({message:"Unauthorized"})
        return
    }

    try {
        await User.updateOne(
            { email: req.user.email },
            { 
                firstName: req.body.firstName, 
                lastName: req.body.lastName, 
                image: req.body.image 
            }
        )
        res.json({ message : "Profile Update Successfully" })

    } catch (error) {
         res.json({message : error.meassage})
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