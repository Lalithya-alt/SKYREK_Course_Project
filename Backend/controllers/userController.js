import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function createUser(req, res) {
    try {
        //find already hass user with the same email
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
                "secretekey99"
            );

      //  return res.json({ message: "Login successful" });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });

    }



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}