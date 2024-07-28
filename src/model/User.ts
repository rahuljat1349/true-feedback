import mongoose, {Schema, Document} from "mongoose";

export  interface Message extends Document{
    content : string,
    createdAt: Date
}


const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true,
        
    },
    createdAt:{
        type:Date,
        required:true,
        default: Date.now
    }
    
})

export  interface User extends Document{
    username : string,
    email: string,
    password: string,
    isVerified:boolean,
    verifyCode :string,
    verifyCodeExpiry:Date,
    isAcceptingMessages:boolean,
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "username is requires"],
        trim: true,
        unique:true,       
    },
    email:{
        type:String,
        required: [true, "email is requires"],
        unique:true,
        match: [/.+\@.+\..+/, "please use a valid email address"]       
    },
    password:{
        type:String,
        required: [true, "password is requires"],
              
    },
    verifyCode:{
        type:String,
        required: [true, "verify code is requires"],
              
    },
    verifyCodeExpiry:{
        type:Date,
        required: [true, "verify code expiry is requires"],     
    },
    isVerified:{
        type:Boolean,
        default: false
    },
    isAcceptingMessages:{
        type:Boolean,
        default: true
    },
    messages: [
        MessageSchema
    ]
    
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel;