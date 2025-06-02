const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const Customer = require("../Models/Customer");

const uploadCustomerCSV = async (req, res) => {
  if (!req.file) return res.status(404).json({ error: "No file uploaded" });
    const userId = req.user.id; 
  let results = [];
  const filePath = path.join(__dirname, "..", req.file.path);

  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const { name, email, spend, visits, lastActiveDays } = row;

        if (name && email && spend && visits && lastActiveDays) {
          results.push({
            userId,
            name,
            email,
            spend: parseFloat(spend),
            visits: parseInt(visits),
            lastActiveDays: parseInt(lastActiveDays),
          });
        }
      })

      .on("end", async () => {
        try {
          await Customer.deleteMany({userId});
          const mergedCustomers = {};

          results.forEach((customer) => {
            const key = customer.email;
            if (!mergedCustomers[key]) {
              mergedCustomers[key] = { ...customer };
            }
          });

          const finalCustomers = Object.values(mergedCustomers);

          console.log("Parsed rows:", results.length);
          console.log("Merged customers:", finalCustomers.length);

          await Customer.insertMany(finalCustomers);
          fs.unlinkSync(filePath);

          const savedCustomers = await Customer.find({userId}).sort({ name: 1 }).lean();

          res.status(200).json({
            message: "CSV processed and customers merged by email",
            count: finalCustomers.length,
            data: savedCustomers,
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to save data" });
        }
      });
  } catch (err) {
    res.status(500).json({ error: "Error processing file" });
  }
};


const getAllCustomers = async (req, res) => {
  try {
     const userId = req.user.id; 
    const customers = await Customer.find({ userId }).sort({ name: 1 });
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

module.exports = { uploadCustomerCSV, getAllCustomers };
