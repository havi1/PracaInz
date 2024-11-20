
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { sample_rooms, sample_tags, sample_users } from './data';
import roomRouter from './routers/room.router';
import userRouter from './routers/user.router';
import reservationRouter from './routers/reservation.router';
import { dbConnect } from './configs/database.config';
const cookieParser = require('cookie-parser');
dbConnect();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}));

app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/reservation", reservationRouter)


const port = 5001;
app.listen(port,() => {
    console.log("Website served on http://localhost:" + port);
})