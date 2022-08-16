const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally
const { Router } = require("express");
const jwt = require('jsonwebtoken');


const app = express(); // Initialize express as an app variable
app.set("port", process.env.PORT || 6969); // Set the port
app.use(express.json()); // Enable the server to handle JSON requests
app.use(cors()); // Dont let local development give errors

app.get("/", (req, res) => {
    res.json({ msg: `Routes are simple and easy to use.
    routes:
    user route add: /users
    product route add: /products
    specific id user route add: /users/the id of the user
    specific id product route add: /products/the id of the product`});
});

app.use('/users', require('./routes/users'))
app.use('/products', require('./routes/products'))

app.listen(app.get("port"), () => {
    console.log(`Listening for calls on port ${app.get("port")}`);
    console.log("Press Ctrl+C to exit server");
}); 