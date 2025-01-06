import { t } from "elysia";
import Elysia from "elysia";
import { prisma } from "../models/db";
import { error } from "console";


export const userRouter = new Elysia ({ prefix: "/user"})
.get("/list", async ({}) => {
    try {
      const users = await prisma.user.findMany({});
      return users;  
    } catch (e) {
        return error(500, "internal Server Error")
    }
})
.post("/create", async ({body}) => {
    try{
    const {email, image, name, password} = body
    const hashedPassword = await Bun.password.hash(password);   
    if(!hashedPassword) {
        return error(500, "Internal Server Error")
    }
    const newUser = await prisma.user.create({
        data: {
           email,
           image, 
           name,
           password: hashedPassword,
        }
   });

   const user = {
    name:newUser.name,
    email:newUser.email,
    image:newUser.image
   }
      return user;
    }catch (e){
        return error(500, "Internal Server Error")
    }
},
{
   body: t.Object({
     name: t.String({
        minLength: 1,
     }),
      email: t.String({
        minLength: 1,
      }),
      password: t.String({
        minLength:1,
      }),
      image: t.String({
       minLength: 1,
      }),
   })
}
)

.put("/:id", async ({body, params}) => {
    const { id } = params;
    const { name } = body  
    const newUser = await prisma.user.update({
        where: {
           id,
        },
           data : {
            name,
           } 
      });
      const user = {
        name: newUser.name,
     }
     return user;       
},
{
   body: t.Object({
     name: t.String({
        minLength: 1,
     }), 
   }),
     params: t.Object({
         id: t.String({
            minLength: 1,
         }), 
       })
}
)

.delete("/:id", async ({params}) => {
    try{
    const {id} = params;
    const deletedUser = await prisma.user.delete({
        where: {
            id:id
        }
    });
      return deletedUser;
    }catch (e){
        return error(500, "Internal Server Error")
    }
},
{
   params: t.Object({
    id: t.String({
        minLength:1,
    })
   })
}

)

// .get("/profile", async ({}) => {
//     return "user profile";
// })




// const userRoute = new Elysia().group("/user", (app) => 
// app.get("/", async() => {
//     try {
//         const users = await prisma.user.findMany({})
//         return users
//     } catch (error) {
        
//     }
// })
// .get("/:id", async(req) => {
//       const {id} = req.params;
//       const user = await prisma.user.findUnique({
//         where: {
//             id: id,
//         }
//       });
//       return user;
// },
// {
//     params: t.Object({
//         id: t.String(),
//     }),
// })
// .post("/",  async ({body}) => { 
//     const { email, image, name, password } = body;
//     const _password = await bcrypt.hash(password, 2);
//     console.log(_password)
//     const newUser = await prisma.user.create({
//         data: {
//             name,
//             email,
//             password:_password,
//             image
//         },
//     })
//     return newUser
// }, 
// {
//   body: t.Object({
//     name: t.String({
//         minLength: 1 
//       }),
//       email: t.String({}),
//       password: t.String({}),
//       image: t.String({
//         minLength:1
//       }), 
//   })  
// })
// .post("/login", async ({body, jwt, set}) => {

// try{
//     const { email, password } = body
//      const user = await prisma.user.findFirst({
//       where: {
//         email,
//     }
//      })
//      const isValidPassword = await bcrypt.compare(password, user?.password || "");

//      if(isValidPassword) {
//                  const token = await jwt.sign(user?.email);
//                 //  const decodedToken = await jwt.verify(
//                 //     "eyJhbGciOiJIUzI1NiJ9.eyIwIjoibiIsIjEiOiJhIiwiMiI6Im0iLCIzIjoiZSIsIjQiOiJhIiwiNSI6IkAiLCI2IjoiZyIsIjciOiJtIiwiOCI6ImEiLCI5IjoiaSIsIjEwIjoibCIsIjExIjoiLiIsIjEyIjoiYyIsIjEzIjoibyIsIjE0IjoibSJ9.M_5y1g9C3lQdvj1SeiLf0RYyJRyZieel0-AzQ7Jnzjc"
//                 // );
//                 // console.log({decodedToken})
//                  return {
//                     token,
//                     user: {
//                         id: user?.id,
//                         name: user?.name,
//                         email: user?.email,
//                         image: user?.image,
//                     },
//                  };
//      }
//      return "";
     
//    }
//    catch(error) {
//      console.log("error on fetching data")
//    }
// },
// {
//    body: t.Object ({ 
//     email: t.String({
//         minLength:1
//     }),
//     password: t.String({
//         minLength:1
//     }),  
//    })
// })
// .put("/:id", (req) => {
//     return req.body
// })
// .delete("/:id", (req) => {
//     return req.params.id
// })
// )
export default userRouter;