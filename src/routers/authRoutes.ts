import { t } from "elysia";
import Elysia from "elysia";
import { prisma } from "../models/db";
import jwt from "@elysiajs/jwt";
import { error } from "console";


export const authRouter = new Elysia({ prefix: "/auth"})
.use(
    jwt({
            secret: Bun.env.JWT_TOKEN as string,
        })
    )
.post("/login", async ({body, jwt}) => {
     try {
        const { email, password} = body;
        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        });
        if(!user) {
            return error(401, "Invalid Credentials")
        }
        const isPasswordCorrect = await Bun.password.verify(
            password,
            user?.password
        );

        if(!isPasswordCorrect) {
            return error(401, "invaild")
        }
    
        const token = await jwt.sign({
            sub: user.id,
        });
       return {
          token,
          user: {
            name: user.name,
            email: user.email,
            image: user.image,
          }
       }
     } catch (e) {
         return error(500, "Internal Server Error")
     }
},
{
   body: t.Object({
      email: t.String({
        minLength: 1,
      }),
      password: t.String({
        minLength:1,
      }),
    //   image:t.String({
    //     minLength:1
    //   })
   })
}
)


    
