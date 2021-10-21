const express = require("express");
//import the connection to the mongoDB here
const connectDB = require("./config/db");

const app = express();

//connect to the database by calling the connectDB function
connectDB();

//using middleware which help in sending data from the request body
app.use(
  express.json({
    extended: false,
  })
);

app.get("/", (req, res) => res.json({ msg: "Welcome to this API" }));

//define our routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
