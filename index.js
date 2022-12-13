import express from "express";
import * as dotenv from "dotenv";
import dbConnection from "./config/db.config.js";
import courseRouter from "./routes/course.routes_old.js";
import govEmployeeRouter from "./routes/govemployee.routes.js";
import adminRouter from "./routes/admin.routes.js";
import cors from "cors";

import coursesfile from "./courses.data.json" assert { type: "json" };
import govemployeesfile from "./govemployee.data.json" assert { type: "json" };
import CourseModel from "./models/course.model.js";
import GovEmployeeModel from "./models/govemployee.model.js";
//import AutenticationModel from "./models/autentication.model.js";

dotenv.config();

dbConnection();

await CourseModel.deleteMany();
await GovEmployeeModel.deleteMany();
//await AutenticationModel.deleteMany();

await CourseModel.insertMany(coursesfile);
await GovEmployeeModel.insertMany(govemployeesfile);

const app = express();
app.use(express.json());

//cors
app.use(cors({ origin: process.env.REACT_URL }));

app.use("/cursos", courseRouter);
app.use("/servidores", govEmployeeRouter);
app.use("/administradores", adminRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server up and running on port: ${process.env.PORT}!`);
});
