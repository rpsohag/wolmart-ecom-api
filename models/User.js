import mongoose from 'mongoose';

const useSchema = new mongoose({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    mobile: {
        type: String,
        trim: true,
        default: null,
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    gender: {
        type: String,
        enum: ["Female", "Male"],
    },
    photo: {
        type: String,
        default: null
    },
    status: {
        type : Boolean,
        default: true,
    },
    trash: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model("User", useSchema)