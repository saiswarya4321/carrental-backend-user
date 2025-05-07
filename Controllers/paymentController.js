const Stripe = require('stripe');
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET); // Correct key name
console.log('Stripe Key:', process.env.STRIPE_SECRET);

const paymentFunction = async (req, res) => {
  
  try {
    const { products ,days} = req.body;

    if (!days || days < 1) {
      return res.status(400).json({ error: "Invalid number of days" });
    }

    const totalPrice = products.pricePerDay * days;

    const line_items = [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${products.model} (${days} days)`,
            images: [products.image],
          },
          unit_amount: Math.round(totalPrice * 100),
        },
        quantity: 1,
      }
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/userdashboard/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/failed`,
    });

    res.status(200).json({ success: true, sessionId: session.id, url: session.url });

  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  paymentFunction
};
