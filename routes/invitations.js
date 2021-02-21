const express = require('express');

const MODEL_PATH = '../models/';
const Invitation = require(MODEL_PATH + 'invitation');

const router = express.Router();

module.exports = function(io) {
    return router;
};

router.get('/getInvitations', (req, res, next) => {

});

router.post('/invite', (req, res, next) => {

});

router.post('/accept', (req, res, next) => {

});

router.post('/decline', (req, res, next) => {

});

