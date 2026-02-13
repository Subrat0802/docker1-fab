import express from "express";
import type {Request, Response} from "express";
import user from "./db";

const app = express();
app.use(express.json());

app.post("/signup", async (req:Request, res: Response) => {
    try{
        const {username, password} = req.body;

        if(!username || !password){
            return res.status(403).json({
                message:"All fields are required"
            })
        }

        const response = await user.create({
            username,
            password
        })

        if(!response){
            return res.status(403).json({
                message:"Error while signup"
            })
        }

        return res.status(200).json({
            message: "user signup successfully",
            response
        })
    }catch(error){
        console.log("error", error);
    }
})


app.post("/signin", async (req:Request, res: Response) => {
    try{
        const {username, password} = req.body;

        if(!username || !password){
            return res.status(403).json({
                message:"All fields are required"
            })
        }

        const response = await user.findOne({
            username,
        })

        if(!response){
            return res.status(403).json({
                message:"Error while signup"
            })
        }

        const matchPassword = response.password === password;

        if(!matchPassword){
            return res.status(409).json({
                message:"Password not match"
            })
        }

        return res.status(200).json({
            message: "user signin successfully",
            response
        })
    }catch(error){
        console.log("error", error);
    }
})


app.get("/test", (req, res) => {
    res.send("Test router")
})


app.listen(3000);