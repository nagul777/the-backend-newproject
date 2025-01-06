import Elysia, { t } from "elysia";
import { prisma } from "../models/db";
import authPlugin from "../middleware/authplugin";
import { nanoid } from "nanoid";
import Stripe from "stripe";


const stripeClient = new Stripe(Bun.env.STRIPE_SECRET_KEY as string, {
     apiVersion: "2024-12-18.acacia"
})

export const orderRouter = new Elysia ({ prefix: "/orders"})

.use(authPlugin)
.post("/", async ({ user, body }) => {
    try{
    const { orderItems, deliveryAddress, totalPrice } = body;
    const orderId = "order_" + nanoid();
     const paymentIntent = await stripeClient.paymentIntents.create({
       amount: totalPrice*100,
       currency: "inr",
     });
    

    const order = await prisma.order.create({
        data: {
            user: {
                connect: {
                    id: user.id
                }
            },
             id: orderId,
           deliveryAddress,
           deliveryStatus: "PENDING",
           totalPrice: totalPrice,
           paymentDetails: {
            amount: paymentIntent.amount,
           },
           paymentIntentId: paymentIntent.id,
           paymentstatus: "PENDING"

         }
    })
    
    const __orderItem = await prisma.orderItem.createMany({
        data: orderItems.map((orderItem) => {
            return {
                quantity: orderItem.quantity,
                price: orderItem.price,
                orderId,
                productId: orderItem.productId,
                
                
            }
        })
    })
     return {
        order,
        clientSecret: paymentIntent.client_secret,
     }

    }catch (error) {
        console.log("Error on Order the items")
    }  
},
{
  body: t.Object({
    deliveryAddress: t.String(),
    totalPrice: t.Number(),
    orderItems: t.Array(
        t.Object({
            productId: t.String(),
            quantity: t.Number(),
            price: t.Number(),
        })
    ),
  }),
 }
)

.get("/", async ({user}) => {
    const orders = await prisma.order.findMany({
        where: {

            userId: user.id,
        },
    });
    return orders
})