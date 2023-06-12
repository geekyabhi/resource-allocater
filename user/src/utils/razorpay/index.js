const Razorpay = require("razorpay");
const { RAZORPAY_API_KEY, RAZORPAY_API_SECRET } = require("../../config");
const { APIError } = require("../error/app-errors");
const crypto = require("crypto");
const rzInstance = new Razorpay({
  key_id: RAZORPAY_API_KEY,
  key_secret: RAZORPAY_API_SECRET,
});

const CreateOrder = async ({ amount, currency }) => {
  try {
    const order = await rzInstance.orders.create({ amount, currency });
    return order;
  } catch (e) {
    throw new APIError(e);
  }
};

const Verify = async (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
) => {
  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", "<YOUR_API_SECRET>")
      .update(body.toString())
      .digest("hex");
    if (expectedSignature === razorpay_signature) return true;
    return false;
  } catch (e) {
    throw new APIError(e);
  }
};

module.exports = { CreateOrder, Verify };
