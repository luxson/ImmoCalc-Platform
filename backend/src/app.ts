import express from 'express';
import cors from 'cors';
import clerkRouter from "./routes/clerk.routes";

const app = express();

app.use(cors({origin: 'http://localhost:3000'})); //whitelist frontend origin
app.use(express.json()); //parse JSON request bodies
app.use("/api/clerk", clerkRouter); // Mount the Clerk routes under the "/clerk" path


export default app;