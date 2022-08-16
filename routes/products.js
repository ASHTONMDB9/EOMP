const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const con = require("../lib/db_connection");
const jwt = require('jsonwebtoken')
const middleware = require("../middleware/auth");

//Get all products
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM products", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});


// Gets one product
router.get("/:id", (req, res) => {
    try {
      con.query(`SELECT * FROM products WHERE id = ${req.params.id}`, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
      // res.send({ id: req.params.id });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });


  router.put("/:id",middleware, (req, res) => {
    // if(req.user.user_type === "Admin") {
    // the below allows you to only need one const, but every input required is inside of the brackets
    const {
        title,
        price,
        description,
        image,
        category,
        created_by,
    } = req.body;
    // OR
    // the below requires you to add everything one by one
    //   const email = req.body.email;
    try {
      con.query(
        //When using the ${}, the content of con.query MUST be in the back tick
        `UPDATE products set title="${title}", price="${price}", description="${description}", image="${image}", category="${category}", created_by="${created_by}" WHERE id = "${req.params.id}"`,
        (err, result) => {
          if (err) throw err;
          res.send("product successfully updated");
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }}
    // else{
    //   res.send("Not an Admin, access denied!");
    // } 
  );


  // Add new products
  router.post("/add_product", (req, res) => {
    // if(req.user.user_type === "Admin") {
    // the below allows you to only need one const, but every input required is inside of the brackets
    const {
      title,
      price,
      description,
      image,
      category,
      created_by,
    } = req.body;
    // OR
    // the below requires you to add everything one by one
    //   const email = req.body.email;
    try {
      con.query(
        //When using the ${}, the content of con.query MUST be in the back tick
        `INSERT INTO products (
            title,
            price,
            description,
            image,
            category,
            created_by) VALUES ( "${title}", "${price}", "${description}", "${image}", "${category}", "${created_by}" )`,
        (err, result) => {
          if (err) throw err;
          res.send("product successfully created");
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }}
    // else{
  //     res.send("Not an Admin, access denied!");
  //   } 
 );
  
  // Delete one products
  router.delete("/:id",middleware, (req, res) => {
    // if(req.user.user_type === "Admin") {
      try {
        con.query(`DELETE FROM products WHERE id = ${req.params.id}`, (err, result) => {
          if (err) throw err;
          res.send("Sucessfully deleted this product");
        });
        // res.send({ id: req.params.id });
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }}
      // else{
      //   res.send("Not an Admin, access denied!");
      //  } 
    );


module.exports = router;