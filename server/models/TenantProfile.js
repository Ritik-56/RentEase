import mongoose from "mongoose";

const TenantSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    maritalStatus:String,
    permanentAddress:String,
    governmentId:String,
    familyMembersCount:Number,
    status:{
        type:String,
        enum:['Active','Pending'],
        required:true
    }

})

const TenantProfile = mongoose.model("TenantProfile",TenantSchema);

export default TenantProfile;