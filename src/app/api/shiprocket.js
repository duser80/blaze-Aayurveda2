import createServerShipRocketOrder from "../../utils/newShiprocket";

const handler = async (req, res) => {
  const response = req.body.response;
  const sellerIds = req.body.sellerIds;
  const address = req.body.address;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const subtotal = req.body.subtotal;

  try {
    const shiprocketOrders = await createServerShipRocketOrder(
      response,
      sellerIds,
      address,
      email,
      phoneNumber,
      subtotal
    );
    res.status(200).json(shiprocketOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
