const express = require('express');

const MODEL_PATH = '../models/';
const Invitation = require(MODEL_PATH + 'invitation');
const User = require(MODEL_PATH + 'user');

const router = express.Router();

module.exports = function(io) {
    return router;
};

router.get('/getByGroup:id', (req, res, next) => {
    Invitation.find({ groupId: req.params.id }).then(result =>{
        res.status(200).json({
            message: "Success",
            invitations: result
        });
    }).catch(err => {
        res.status(500).json({
            error : err
        })
    });
});

router.get('/getByUser:id', (req, res, next) => {
    Invitation.find({ userId: req.params.id }).then(result =>{
        res.status(200).json({
            message: "Success",
            invitations: result
        });
    }).catch(err => {
        res.status(500).json({
            error : err
        })
    });
});

router.post('/invite', (req, res, next) => {
    const invitation = new Invitation({
        groupId: req.body.invitation.groupId,
        groupName: req.body.invitation.groupName,
        userId: req.body.invitation.userId,
        userName: req.body.invitation.userName,
    });

    invitation.save().then(result => {
        res.status(201).json({
            message: 'Success',
            invitation: result
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/accept', (req, res, next) => {
    User.updateOne({ _id: req.body.invitation.userId }, { $push: {groups: {groupId: req.body.invitation.groupId, groupName: req.body.invitation.groupName, groupAdmin: false}}}).then(result1 => {
        Invitation.deleteOne({'_id': req.body.invitation._id}).then(result2 => {
            res.status(201).json({
                message: 'Success',
                res: {
                    user: result1,
                    invitation: result2
                }
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
    Invitation.deleteOne({'_id': req.body.invitation._id}).then(result => {
        res.status(201).json({
            message: 'Success',
            res: result
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;
