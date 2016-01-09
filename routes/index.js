var express = require('express');
var router = express.Router();

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

var querystring = require('querystring');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
    stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY });
});

router.post('/charge', function(req, res, next) {

  // (Assuming you're using express - expressjs.com)
  // Get the credit card details submitted by the form
  var stripeToken = req.body.stripeToken;
  var stripeEmail = req.body.stripeEmail;
  var amount = 3999;
  var description = "1st Edition Fedora Hat";

  console.log('--------------');
  console.log('CHARGE OBJECT:');
  console.log(req.body);
  console.log('--------------');

  if (!stripeToken || !stripeEmail) {
    // do something with error
    res.redirect('/charge-error-baby');
    return;
  }

  var charge = stripe.charges.create({
    amount: amount, // amount in cents, again
    currency: "gbp",
    source: stripeToken,
    receipt_email: stripeEmail,
    description: description
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
      res.redirect('/charge-error-baby');
    } else {
      res.redirect('/charge?' + querystring.stringify({
        title: 'Charge',
        description: charge.description,
        total: (charge.amount / 100) + charge.currency.toUpperCase(),
        trans_id: charge.id
      }));
    }
  });

});

router.get('/charge', function(req, res) {
  res.render('charge', {
    // title: 'Charge',
    title: req.query.title,
    // descrption: charge.description,
    description: req.query.description,
    // total: (charge.amount / 100) + charge.currency.toUpperCase(),
    total: req.query.total,
    // trans_id: charge.id
    trans_id: req.query.trans_id
  });
});

module.exports = router;
