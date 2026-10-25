import express from 'express';
import routes from "./routes/index.js";
import cors from 'cors';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());



app.use("/api", routes)

app.use(globalErrorHandler);

export default app;