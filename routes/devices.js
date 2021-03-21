const express = require('express');

const MODEL_PATH = '../models/';
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

module.exports = function(io) {
    return router;
};

router.get('/getByUser:id', (req, res, next) => {
    Device.find({ userId: req.params.id }).then(result =>{
        res.status(200).json({
            message: "Success",
            devices: result
        });
    }).catch(err => {
        res.status(500).json({
            error : err
        })
    });
});

module.exports = router;
