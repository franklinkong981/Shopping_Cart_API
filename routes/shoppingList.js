const express = require("express");
const router = new express.Router();

const ExpressError = require("../errors/expressError");
const items = require("../database/fakeDb");

//all shoppingList routes go here
router.get("/", function(req, res) {
  res.json({items});
});

router.post("/", function(req, res, next) {
  try {
    if (!req.body.name) throw new ExpressError("Name is required", 400);
    if (!req.body.price) throw new ExpressError("Price is required", 400);
    const newItem = {name: req.body.name, price: req.body.price};
    items.push(newItem);
    return res.status(201).json({added: newItem});
  } catch(e) {
    return next(e);
  }
});

router.get("/:name", function(req, res, next) {
  try {
    const foundItem = items.find(item => item.name == req.params.name);
    if (foundItem == undefined) throw new ExpressError("Item not found", 404);
    res.json({item: foundItem});
  } catch(e) {
    return next(e);
  }
});

router.patch("/:name", function(req, res, next) {
  try {
    const foundItem = items.find(item => item.name == req.params.name);
    if (foundItem == undefined) throw new ExpressError("Item not found", 404);
    if (req.body.name) foundItem.name = req.body.name;
    if (req.body.price) foundItem.price = req.body.price;
    res.json({updatedItem: foundItem});
  } catch(e) {
    return next(e);
  }
});

module.exports = router;