const express = require("express");
//import the connection to the mongoDB here
const connectDB = require("./config/db");

const app = express();

const path = require("path");

//connect to the database by calling the connectDB function
connectDB();

//using middleware which help in sending data from the request body
app.use(
  express.json({
    extended: false,
  })
);

// app.get("/", (req, res) => res.json({ msg: "Welcome to this API" }));

//define our routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

//entry point for the frontend application
//serve static assets in production
if (process.env.NODE_ENV === "production") {
  //serve the react build in the client folder
  app.use(express.static("client/build"));

  //set a route
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
} else {
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
