import mongoose from "mongoose"
import logger from "./logger";
import { Config } from ".";
import { DB_NAME } from "../constants";

export const connectDB=async ()=>{
    try {
        const connectionInstance=await mongoose.connect(`${Config.MONGO_DB_URL}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        logger.info(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MONGODB connection FAILED ", error)
        logger.error("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}