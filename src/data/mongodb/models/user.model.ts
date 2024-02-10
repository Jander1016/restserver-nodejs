import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    img:{
        type: String,
        required: false,
    },
    role:{
        type: [String],
        required: true,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    }
}, { timestamps: true })

export const UserModel = mongoose.model('User', userSchema);