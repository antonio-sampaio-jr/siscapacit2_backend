import express from "express";
import * as dotenv from "dotenv";
import dbConnection from "./config/db.config.js";
import courseRouter from './routes/course.routes.js'
import govEmployeeRouter from './routes/govemployee.routes.js'

dotenv.config();

dbConnection();

const app = express();
app.use(express.json());

app.use('/cursos', courseRouter);
app.use('/servidores', govEmployeeRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server up and running on port: ${process.env.PORT}!`);
});


