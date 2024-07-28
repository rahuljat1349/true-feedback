import { z } from "zod"



export const  userNameValidation = z
.string()
.min(2,"username must be atleast 2 characters long!")
.max(20,"username must not exceed 20 characters!")
.regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters!")


export const userSchema  = z.object({
    username: userNameValidation,
    email: z.string().email({message:"invalid email address"}),
    password: z.string().min(6,{message:"password must be at least 6 charcters long"})
})