import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(cors());
// initialisation Stripe und conekt mit server
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json()); // JSON =>body

// Endpoint für session
app.post("/create-checkout-session", async (req, res) => {
  const { nickname, email, amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "StayTime - IP: 172.16.100.200",
            },
            unit_amount: Math.round(amount * 100), // in Cent
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: "http://localhost:3000/success.html",
      cancel_url: "http://localhost:3000/cancel.html",
      metadata: {
        nickname: nickname,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Щось пішло не так" });
  }
});

// Запускаємо сервер
app.listen(4242, () => console.log("Сервер запущено на http://localhost:4242"));
