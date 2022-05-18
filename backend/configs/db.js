require("dotenv").config();
const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `MongoDB connection SUCCESS ${conn.connection.host}`.cyan.underline
    );
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    console.error("MongoDB connection FAIL");
    process.exit(1);
  }
};
module.exports = connectDB;
