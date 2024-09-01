const express = require("express");
const router = new express.Router();

const ExpressError = require("../errors/expressError");
const items = require("../database/fakeDb");

//all shoppingList routes go here
router.get("/", function(req, res) {
  res.json({items});
});



module.exports = router;