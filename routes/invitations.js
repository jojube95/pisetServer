const express = require('express');

const MODEL_PATH = '../models/';
const Invitation = require(MODEL_PATH + 'invitation');
const User = require(MODEL_PATH + 'user');

const router = express.Router();

module.exports = function(io) {
    return router;
};

router.get('/getInvitations', (req, res, next) => {
    Invitation.findOne({ userId: req.params.id }).then(result =>{
        res.status(200).json({
            message: "Success",
            task: result
        });
    }).catch(err => {
        res.status(500).json({
            error : err
        })
    });
});

router.post('/invite', (req, res, next) => {
    const invitation = new Invitation({
        userId: req.body.userId,
        groupId: req.body.groupId,
        groupName: req.body.groupName
    });

    invitation.save().then(result => {
        res.status(201).json({
            message: 'Invitation added successfully',
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/accept', (req, res, next) => {
    User.updateOne(
        {'_id': req.body.userId}, { $set: { groupId: req.body.groupId, groupName: req.body.groupName }
    }).then(result => {
        Invitation.deleteOne({'_id': req.body.id}).then(result => {
            res.status(201).json({
                message: 'Invitation accepted successfully',
                result: result
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/decline', (req, res, next) => {
    Invitation.deleteOne({'_id': req.body.id}).then(result => {
        res.status(201).json({
            message: 'Invitation deleted successfully',
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

