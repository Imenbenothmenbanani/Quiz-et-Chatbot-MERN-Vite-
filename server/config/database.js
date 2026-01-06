require("dotenv").config();
const mongoose = require("mongoose");

exports.connectToDB = () => {
    console.log("Trying to connect with:", process.env.MONGO_URI);
    mongoose.connect(process.env.MONGO_URI, {})
        .then(() => {
            console.log("Database connection successful")
        })
        .catch((e) => {
            console.log("Error occurred while connecting to DB")
            console.error(e);
            process.exit(1);
        });
}
