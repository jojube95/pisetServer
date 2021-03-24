const express = require('express');

const MODEL_PATH = '../models/';
const State = require(MODEL_PATH + 'state');

const router = express.Router();

module.exports = function(io) {
    return router;
};


router.get('/get', (req, res, next) => {
    State.find().then(result =>{
        res.status(200).json({
            message: "Success",
            states: result
        });
    }).catch(err => {
        res.status(500).json({
            error : err
        })
    });
});

module.exports = router;
