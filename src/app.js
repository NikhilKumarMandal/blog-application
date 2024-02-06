import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import passport from "passport";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.set("view engine","ejs")


//routes import
import userRouter from "./routes/user.routes.js"
import blogRouter from "./routes/blog.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/blogs", blogRouter)

app.use(passport.initialize());




export { app }