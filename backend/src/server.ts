'use strict'

import app from "./app"
import { Config } from "./config"
import { connectDB } from "./config/dbConnection"
import logger from "./config/logger"

const startServer=async()=>{
    const PORT=Config.PORT
    try {
        //db connection
     await connectDB()
     app.listen(PORT,()=>{
        logger.info("server is runing successfully",{port:PORT})
     })

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


startServer()