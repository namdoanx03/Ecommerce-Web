import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    address_line : {
        type : String,
        default : ""
    },
    district : {
        type : String,
        default : ""
    },
    province : {
        type : String,
        default : ""
    },
    ward : {
        type : String
    },
    name : {
        type : String
    },
    mobile : {
        type : Number,
        default : null
    },
    email : {
        type : String,
        default : null
    },
    status : {
        type : Boolean,
        default : true
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        default : ""
    }
},{
    timestamps : true
})

const AddressModel = mongoose.model('address',addressSchema)

export default AddressModel