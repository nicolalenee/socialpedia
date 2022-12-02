import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
//native packages
import path from 'path';
import { fileURLToPath } from 'url';
import { register} from "./controllers/auth.js";

/* CONFIGURATIONS OF MIDDLEWARE */

// grab file url and directory url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded( { limit: "30mb", extended: true}));
app.use(cors());
// set directory of where we keep the image assets
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE CONFIGURATION */
const storage = multer.diskStorage({
  // when a user stores an image on our website it will be stored in this folder
  destination: function (req, file, cb) {
    cb(null,"public/assets");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
})
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register) // hit route, upload our picture locally in our dir, then register controller

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(PORT, () => console.log(`🌎 Server connected! Server Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));