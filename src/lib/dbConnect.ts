import mongoose from "mongoose"

type connectionObject = {
    isConnected?: number
}

const connection:connectionObject = {}


async function dbConnect(): Promise<void> {
    
    if (connection.isConnected) {
        console.log("Alresdy connect to DataBase.");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "", {})

        connection.isConnected = db.connections[0].readyState;

        console.log("DB connected successfully!");
        
    } catch (error) {


        console.log("DataBase connection failed!",error);
        
        process.exit()
        
    }
}

export default dbConnect;