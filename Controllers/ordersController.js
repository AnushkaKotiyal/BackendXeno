const Order = require("../Models/Orders");
const csv = require("csv-parser");
const fs = require("fs");

const uploadOrdersCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "CSV file is required" });
    }
    const userId = req.user.id; 
    const orders = [];  
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => orders.push(data))
      .on("end", async () => {
        const formattedOrders = [];
        await Order.deleteMany({ userId });
        for (let order of orders) {
          const { customer, orderDate, items, totalAmount, status } = order;

          // Safe item parsing
          let parsedItems;
          try {
            parsedItems = JSON.parse(items.replace(/""/g, '"'));
          } catch (e) {
            return res
              .status(400)
              .json({ error: `Invalid items JSON for customer ${customer}` });
          }

          // Safe date parsing
          const parsedDate = new Date(orderDate);
          if (isNaN(parsedDate.getTime())) {
            return res
              .status(400)
              .json({ error: `Invalid orderDate for customer ${customer}` });
          }

          formattedOrders.push({
            userId,
            customer,
            items: parsedItems.map((item) => ({
              productName: item.productName,
              quantity: Number(item.quantity),
              price: Number(item.price),
            })),
            orderDate: parsedDate,
            totalAmount: Number(totalAmount),
            status: status || "Pending",
          });
        }

        if (formattedOrders.length === 0) {
          return res
            .status(400)
            .json({ error: "No valid orders found in file." });
        }

        await Order.insertMany(formattedOrders);
        fs.unlinkSync(req.file.path);

        res.status(201).json({
          message: "Orders uploaded successfully",
          count: formattedOrders.length,
          orders: formattedOrders, // ✅ include orders in response
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload orders CSV" });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
      const userId = req.user.id; 
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

module.exports = {
  uploadOrdersCSV,
  getAllOrders,
};
