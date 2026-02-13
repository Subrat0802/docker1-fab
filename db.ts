import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL
mongoose.connect(mongoUrl ?? "mongodb://localhost:27017/docker-2");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true  // Changed from 'require' to 'required'
    },
    password: {
        type: String,
        required: true  // Changed from 'require' to 'required'
    }
})

const user = mongoose.model("user", userSchema);
export default user;