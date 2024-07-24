import { errorMiddleware } from "./errorHandler/errorMiddleware";
import express, { Express } from "express";
const app: Express = express();
import dotenv from "dotenv";
import cors from "cors";
import { sequelize } from "./models";
import cookieParser from "cookie-parser";


app.use(express.json());
app.use(cookieParser());
dotenv.config();


const corsOptions = {
  origin: "http://localhost:5173/",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  optionsSuccessStatus: 204,
  credentials: true,
};
app.use(cors(corsOptions));


import { router as userRouter } from "./routes/users.route";
import { router as sectorRouter } from "./routes/sectors.route";

app.use('/users', userRouter);
app.use('/sectors', sectorRouter);
app.use(errorMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`running on port ${PORT}`);
  await sequelize.authenticate()
    .then(async () => {
      console.log('DB 연결 성공');
    })
    .catch(e => {
      console.log(e)
    })
});