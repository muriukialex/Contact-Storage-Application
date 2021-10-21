//use mongoose to connect to the database
const mongoose = require("mongoose");

//use config to get access to the global variables
const config = require("config");

//use the mongoURI to connect to the Database by getting it as a global variable using config.get()
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("mongoDB connected!");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// const connectDB = () => {
//   mongoose
//     .connect(db, {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//     })
//     .then(() => {
//       console.log("mongoDB connected!");
//     })
//     .catch((err) => {
//       console.error(err.message);
//       process.exit(1); //if it fails we exit with failure which is process.exit(1)
//     });
// };

module.exports = connectDB;
