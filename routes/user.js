const express = require('express');
const PiggyBank = require('../models/piggy-bank');
const PiggyModel = require('../models/piggy-model');
const Currency = require('../models/currency');
const User = require('../models/user')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')

router.get('/:type/:code', catchAsync(async (req, res) => {
    const userType = req.params.type;
    if (userType !== 'main') {
        res.send(404);
        return;
    }
    const userCode = req.params.code;
    const users = await User.find({});
    let update = false;
    for (let user of users) {
        if (user.type === userType) {
            await User.findByIdAndUpdate(user._id, {code: userCode})
            update = true;
        }
    }
    if (!update) {
        const newUser = new User({type: userType, code: userCode});
        await User.create(newUser);
    }
}));

module.exports = router;