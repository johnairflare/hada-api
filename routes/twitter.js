var express = require('express');
var router = express.Router();

router.use('/tweets/:lat/:long', require('../controllers/twitterController'));

module.exports = router;
