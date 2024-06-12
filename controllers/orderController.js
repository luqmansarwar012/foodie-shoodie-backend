import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const Stripe = new stripe(process.env.STRIPE_SECRET_KEY);
// placing userOrder form frontend
const placeOrder = async (req, res) => {
  const { userId, items, amount, address } = req.body;
  const frontendURL = process.env.FRONTEND_URL;
  try {
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "aed",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 3.67,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: "aed",
        product_data: {
          name: "Delievery Charges",
        },
        unit_amount: 10 * 100 * 3.67,
      },
      quantity: 1,
    });
    const session = await Stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontendURL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendURL}/verify?success=false&orderId=${newOrder._id}`,
    });
    console.log("====================================");
    console.log("Logs in backend(Placeorder)");
    console.log("base frontend url", frontendURL);
    console.log("session url: ", session.url);
    console.log("====================================");
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong!" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    console.log(typeof success);
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid!" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not paid!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong!" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong!" });
  }
};

// api for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status updated!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong!" });
  }
};
export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
