import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    password:String,
    role:{
        type:String,
        enum:['Admin','Tenant'],
        required:true
    }
})

const User = mongoose.model('User',UserSchema);

export default User;
