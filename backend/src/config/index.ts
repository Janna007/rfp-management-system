import { config } from 'dotenv'
import path from 'path'


config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
})

const {
    PORT,
    MONGO_DB_URL,
    GEMINI_API_KEY,
    EMAIL_USER,
    EMAIL_APP_PASSWORD
    
} = process.env

export const Config = {
    PORT,
    MONGO_DB_URL,
    GEMINI_API_KEY,
    EMAIL_USER,
    EMAIL_APP_PASSWORD
}
