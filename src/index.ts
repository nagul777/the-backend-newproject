import { Elysia } from "elysia";
import  productrouter from "./routers/prodectrouter";
import userRoute from "./routers/userroute";
import swagger from "@elysiajs/swagger";
import { logger } from "@bogeychan/elysia-logger";
import jwt from "@elysiajs/jwt";
import cors from "@elysiajs/cors";
import { orderRouter } from "./routers/orderRouter";
import { authRouter } from "./routers/authRoutes";


const app = new Elysia();


app.use(cors({
  origin: "*"
}))



app.use(
  jwt({
      name: 'jwt',
      secret: process.env.JWT_TOKEN as string, 
  })
)


app.get("/", () => {
  console.log(process.env.JWT_TOKEN)
  return "Hello Elysia"
})
app.use(swagger())
app.use(logger())
app.get("/plugin", () => "hi", {
  hi: "Elysia",
});
app.use(productrouter)
app.use(userRoute)
app.use(authRouter)
app.use(orderRouter)
.listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
