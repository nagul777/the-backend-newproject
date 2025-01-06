import Elysia, {t} from "elysia";
import { prisma } from "../models/db";
import  authPlugin  from "../middleware/authplugin";

export const productRouter = new Elysia ({ prefix: "/products"})

.get("/list", async () => {  
    try {
       const product = await prisma.product.findMany();
       return product;
    } catch (error) {
      console.log("Error fetching products:", error);
      return {error: "Failed to fetch products."}
    }
})



.get("/:id", async({params}) => {
  try {
    const { id } = params
    const product = await prisma.product.findFirst({
      where: {
          id,
      },
    })
    if(!product) {
      return{ error: "product not Exicted"}
    }
    return product; 
 } catch (error) {
      return {error: "product are not come"}
  }
 },
 {
  params: t.Object({
    id: t.String({
      minLength:1,
    }),
  }),
 }
)
.post("/", async(req) => {
  const product = await prisma.product.create({
     data: {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        stock: req.body.stock,
     },
  });
  return product
},
{
  body: t.Object({
    name: t.String({
     minLength:1
    }),
    price: t.Number(),
    description: t.String({
     minLength:1
    }),
    image: t.String(),
    stock: t.Number(),
  })
}
)
.delete("/:id", async ({params}) => {
  try{
  const {id} = params;
  const deletedProduct = await prisma.product.delete({
      where: {
          id
      }
  });
    return deletedProduct;
  }catch (error){
      return {error: "Internal Server Error" };
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
 .put("/:id", async (req) => {
   const productInfo = req.body;
   const productId = req.params.id;
   const updateedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: productInfo.name,
        price: productInfo.price,
        description: productInfo.description,
        image: productInfo.image,
        stock: productInfo.stock,
      },
    })

    return updateedProduct;
 },
 {
   body: t.Object({
     name: t.String(),
     price: t.Number(),
     description: t.String(),
     image: t.String(),
     stock: t.Number(),
   }),
   params: t.Object({
      id: t.String(),
   })
 })
.use(authPlugin)

export default productRouter;