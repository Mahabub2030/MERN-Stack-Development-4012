import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);


const PORT = 4000;
const Employee = mongoose.model("Employee", new mongoose.Schema({
  employeeName: String,
  jobDescription: String,
  iqamaId: String,
  dacoId: String,
  group: String,
  joiningDate: String,
  phone: String,
  email: String,
  nationality: String,
  status: String
}));

app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.get("/employees", async (req, res) => {
  try {
    const data = await Employee.find(); // Fetch all employees
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees", details: error.message });
  }
});



app.listen(PORT, () => console.log(`DB connected on server port: ${PORT}`));
