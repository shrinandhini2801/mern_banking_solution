const express = require("express");
const router = express.Router();

// Load Customer model
const Customer = require("../../dbmodels/Customer");
const { Mongoose } = require("mongoose");

// @route GET api/test
// @description tests books route
// @access Public
router.get("/test", (req, res) => res.send("book route testing!"));

/**
 * @route - GET - api/
 * @description - Get all customers details
 *
 */
router.get("/", (req, res) => {
  Customer.find()
    .then((customers) => res.json(customers))
    .catch((err) =>
      res.status(404).json({ nodatafound: "No Customer data found" })
    );
});
/**
 * @route - GET - api/:customerid
 * @description - Get customer by customerid
 *
 */
router.get("/:customerid", (req, res) => {
  Customer.find({ customer_id: req.params.customerid })
    .then((details) => res.json(details))
    .catch((err) => res.status(404).json({ nodatafound: "No data found" }));
});

/**
 * @route - GET - api/account/:accountno
 * @description - Get customer by customerid
 *
 */
router.get("/account/:accountno", (req, res) => {
  Customer.find({ account_number: req.params.accountno })
    .then((details) => res.json(details))
    .catch((err) => res.status(404).json({ nodatafound: "No data found" }));
});

router.post("/update/:accountno", (req, res) => {
  console.log("req body", req);
  Customer.findOneAndUpdate(
    { account_number: req.params.accountno },
    { $inc: { account_balance: req.body.account_balance } },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    }
  );
});

module.exports = router;
