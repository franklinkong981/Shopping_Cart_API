const express = require("express");
const morgan = require("morgan");

const ExpressError = require("./errors/expressError");
const shoppingListRoutes = require("./routes/shoppingList");

const app = express();

//allow express to read form and JSON data sent in POST requests.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use middleware logging function and prevent printing favicon.ico error to terminal
app.use(morgan('dev'));

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

//Use Routes organized into other files using Express Router.
app.use('/items', shoppingListRoutes);

//404 handler
app.use(function(req,res, next) {
  const e = new ExpressError("Page Not Found", 404);
  next(e);
});

//generic error handler
app.use(function(err, req, res, next) {
  //the default status is the 500 Internal Server Error
  let status = err.status || 500;

  //set the status and alert the user
  return res.status(status).json({
    error: {
      message: err.message,
      status: status
    }
  });
});

module.exports = app;