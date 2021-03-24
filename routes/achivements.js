const express = require('express');

const MODEL_PATH = '../models/';
const Achivement = require(MODEL_PATH + 'achivement');
const User = require(MODEL_PATH + 'user');

const router = express.Router();

module.exports = function(io) {
    return router;
};

router.get('/get', (req, res, next) => {
    Achivement.find().then(result =>{
        res.status(200).json({
            message: "Success",
            achivements: result
        });
    }).catch(err => {
        res.status(500).json({
            error : err
        })
    });
});

router.get('/getByUser:id', (req, res, next) => {
    User.findOne({ _id: req.params.id }).then(user =>{
        res.status(200).json({
            message: "Success",
            achivements: user.achivements
        });
    }).catch(err => {
        res.status(500).json({
            error : err
        })
    });
});

module.exports = router;
