const PiggyBank = require('../models/piggy-bank');
const PiggyModel = require('../models/piggy-model');
const Currency = require('../models/currency');
const User = require('../models/user');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const themecolor = '#4B9CD3';

router.get('/login', catchAsync(async (req, res) => {
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('user/login', {themecolor, currency, user});
}))

router.get('/change', catchAsync(async (req, res) => {
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('user/change', {themecolor, currency, user});
}))

router.get('/admin', catchAsync(async (req, res) => {
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('user/admin', {themecolor, currency, user});
}))

router.post('/login', catchAsync(async (req, res) => {
    const code = req.body.code;
    const users = await User.find({});
    let type = '';
    let name = 'Visitor';
    for (let user of users) {
        if (code === user.code) {
            type = user.type;
            name = user.name;
        }
    }
    if (!type) {
        console.log('invalid');
    } else {
        res.cookie('type', type);
        res.cookie('name', name);
    }
    res.redirect(`/user/login`);
}))

router.post('/logout', catchAsync(async (req, res) => {
    res.cookie('type', '');
    res.cookie('name', 'Visitor');
    res.redirect(`/user/login`);
}))

router.post('/admin/reset-points', catchAsync(async (req, res) => {
    await Currency.deleteMany({});
    const currency = new Currency({potatoes: 0, watermelons: 0, eggs: 0});
    await currency.save();
    res.redirect(`/user/admin`);
}))

router.post('/admin/reset-piggy-bank', catchAsync(async (req, res) => {
    await PiggyBank.deleteMany({});
    res.redirect(`/user/admin`);
}))

router.post('/admin/reset-piggy-model', catchAsync(async (req, res) => {
    await PiggyModel.deleteMany({});
    res.redirect(`/user/admin`);
}))

router.post('/admin/reset-main-secret-code', catchAsync(async (req, res) => {
    const users = await User.find({});
    for (let user of users) {
        if (user.type === 'Main'){
            await User.findByIdAndUpdate(user._id, {code: 'Main'});
        }
    }
    res.redirect(`/user/admin`);
}))

router.post('/admin/reset-secondary-secret-code', catchAsync(async (req, res) => {
    const users = await User.find({});
    for (let user of users) {
        if (user.type === 'Secondary'){
            await User.findByIdAndUpdate(user._id, {code: 'Secondary'});
        }
    }
    res.redirect(`/user/admin`);
}))

router.put('/change', catchAsync(async (req, res) => {
    const users = await User.find({});
    for (let user of users) {
        if (req.body.newuser && user.type === req.cookies.type){
            res.cookie('name', req.body.newuser);
            await User.findByIdAndUpdate(user._id, {name: req.body.newuser, code: req.body.newcode});
        }
    }
    res.redirect(`/user/change`);
}))

module.exports = router;