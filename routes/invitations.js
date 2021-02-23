const express = require('express');

const MODEL_PATH = '../models/';
const Invitation = require(MODEL_PATH + 'invitation');
const User = require(MODEL_PATH + 'user');

const router = express.Router();

module.exports = function(io) {
    return router;
};

router.get('/getInvitations:id', (req, res, next) => {
    console.log('getInvitations');
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
        senderMail: req.body.invitation.senderMail,
        invitedUserId: req.body.invitation.invitedUserId,
        invitedGroupId: req.body.invitation.invitedGroupId,
        invitedGroupName: req.body.invitation.invitedGroupName,
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
        {'_id': req.body.invitation.userId}, { $set: { groupId: req.body.invitation.groupId, groupName: req.body.invitation.groupName }
    }).then(result => {
        Invitation.deleteOne({'_id': req.body.invitation._id}).then(result => {
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
    Invitation.deleteOne({'_id': req.body.invitation.id}).then(result => {
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

module.exports = router;
