import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"Fullname is required!"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required!"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Email is required!"]
    },

    refreshToken:String,

    refreshTokenExpiry:String
},{timestamps:true})

userSchema.methods.generateAccessToken =  function(password){
    return jwt.sign({
        _id : this._id,
        username : this.username,
        email : this.email
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}

userSchema.methods.generateRefreshToken =  function(password){
    return jwt.sign({
        _id : this._id,
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}

userSchema.methods.isPasswordCorrect = function(password){
         return bcrypt.compare(password,this.password)
} 

const User = mongoose.model("User",userSchema)

export {User}
