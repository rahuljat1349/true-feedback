import { Message } from "@/model/User";

export interface ApiRespons{
    success:boolean
    message:string
    isAcceptingMessages?:boolean
    messages?: Array<Message>
}