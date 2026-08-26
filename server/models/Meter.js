import mongoose from "mongoose";

const MeterSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true
    },
    meterNumber:String,
    currentReading:Number,
    previousReading:Number
})

const Meter = mongoose.model("Meter",MeterSchema);

export default Meter;

