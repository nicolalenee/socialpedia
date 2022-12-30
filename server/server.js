const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const helmet = require("helmet");
const morgan = require("morgan");
//native packages
const path = require("path");
const { fileURLToPath } = require("url");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const { register } = require("./controllers/auth");
const { createPost } = require("./controllers/posts");
const { verifyToken } = require("./middleware/auth");
const db = require("./config/conection");

/* CONFIGURATIONS OF MIDDLEWARE */

// grab file url and directory url
// const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// set directory of where we keep the image assets
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE CONFIGURATION */
const storage = multer.diskStorage({
  // when a user stores an image on our website it will be stored in this folder
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register); // hit route, upload our picture locally in our dir, then register controller
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
