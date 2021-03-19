const express = require('express');

const MODEL_PATH = '../models/';
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

module.exports = function(io) {
    return router;
};


module.exports = router;
