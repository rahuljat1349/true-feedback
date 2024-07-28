import {z} from "zod"




export const signInSchema = z.object({
    email:z.string(),
    paasword:z.string()
    
})