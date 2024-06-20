import express from "express";
import {
  authencationRouter,
  blogRouter,
  notifyRouter,
  reviewRouter,
  otpRouter,
  talentRouter,
  portfolioRouter,
  servicesRouter,
  templateCvRouter,
  recruitmentRouter,
  profileUserRouter,
  appliuserRouter,
  coverletterRouter,
  companypoolsRouter,
  joblistRouter,
  firebaseRouter
} from "./routers/index.js";
import "./loadEnvironment.js";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = process.env.PORT ?? 3000;

mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Em thêm whitelist cái domain của FE vào đây. Kiểu thế, nếu bị CORS
const whitelist = ["http://localhost:3003", "https://investy.io.vn", "http://localhost:6868", "http://10.60.245.31:3003"]; //white list consumers
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "device-remember-token",
    "Access-Control-Allow-Origin",
    "Origin",
    "Accept",
  ],
};
app.use(cors(corsOptions));
// app.use(cors());
app.use("/", authencationRouter);
app.use("/", notifyRouter);
app.use("/", otpRouter);
app.use("/blog", blogRouter);
app.use("/", reviewRouter);
app.use("/", talentRouter);
app.use("/", portfolioRouter);
app.use("/", servicesRouter);
app.use("/", recruitmentRouter);
app.use("/", appliuserRouter);
app.use("/", coverletterRouter);
app.use("/cvtemplate", templateCvRouter);
app.use("/user/profile", profileUserRouter);
app.use("/applicants", companypoolsRouter);
app.use("/jobpool", joblistRouter);
app.use("/template", templateCvRouter)
app.use("/firebase", firebaseRouter)



app.listen(port, async () => {
  console.log(`listening on port : ${port}`);
});
