import { configDotenv } from "dotenv";
import connectToDatabase from "./db";
import app from "./app";

// Database connection and server setup
console.log('Starting server...');
const port = process.env.PORT || 4000;

configDotenv({path: "./.env"}); // Load environment variables from .env file

connectToDatabase()
    .then(() => {
        console.log('Database connection established. Starting server...');
        // Start the server after successful database connection
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }).catch((error) => {
        console.error('Failed to connect to the database:', error.message);
        process.exit(1); // Exit the process with an error code
    });
    //