import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
dotenv.config();

// import middlewares
import morgan from "morgan";
import cors from "cors";
import invalidJsonMiddleware from "./middlewares/invalidJsonMiddleware.ts";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.ts";

// Check DB connection
import { checkDatabaseConnection } from "./libs/checkDbConnection.ts";
checkDatabaseConnection();

// import routers
import studentRouter_v3 from "./routes/studentsRoutes_v3.ts";
import courseRouter_v3 from "./routes/coursesRouters_v3.ts";
import userRouter_v3 from "./routes/usersRouters_v3.ts";
import fileRouter_v1 from "./routes/fileRouters_v1.ts";
import enrollmentRouter_v3 from "./routes/enrollmentsRouters_v3.ts";

const app = express();
const port = process.env.PORT || 3000;

// Configure exact frontend origins; multiple values can be comma-separated.
const configuredCorsOrigins = process.env.CORS_ORIGIN?.split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);
const corsOrigins =
  configuredCorsOrigins && configuredCorsOrigins.length > 0
    ? configuredCorsOrigins
    : process.env.NODE_ENV === "production"
      ? []
      : ["http://localhost:5173"];

app.use(
  cors({
    origin: corsOrigins,
  }),
);

// body parser middleware
app.use(express.json());

// logger middleware
app.use(morgan("dev"));
// app.use(morgan("combined"));

// JSON parser middleware
app.use(invalidJsonMiddleware);

// Endpoints
app.get("/", (req: Request, res: Response) => {
  res.send("Lecture10 API services");
});

app.get("/me", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Student Information",
    data: {
      studentId: "680610717",
      firstName: "Wiriyaphat",
      lastName: "Phromphong",
      program: "CPE",
      section: "001",
    },
  });
});

// use routers
app.use("/api/v3/users", userRouter_v3);
app.use("/api/v3/students", studentRouter_v3);
app.use("/api/v3/courses", courseRouter_v3);
app.use("/api/v3/file", fileRouter_v1);
app.use("/api/v3/enrollments", enrollmentRouter_v3);

// endpoint check middleware
app.use(notFoundMiddleware);

// ถ้าไม่ใช่บน Vercel (รันโลคัล) ถึงค่อยเรียก app.listen
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

// Export app for vercel deployment
export default app;
