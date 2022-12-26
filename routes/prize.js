const Currency = require('../models/currency');
const Inventory = require('../models/inventory');
const Store = require('../models/store');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const PiggyModel = require("../models/piggy-model");

router.get('/store', catchAsync(async (req, res) => {
    const prizes = await Store.find({}).sort({priority: 1});
    const currency = await Currency.find({});
    const user = req.cookies;
    const themeColor = '#fa554f';
    res.render('prize/store', {prizes, currency, themeColor, user});
}))

router.get('/store/new-prize', async (req, res) => {
    const currency = await Currency.find({});
    const user = req.cookies;
    const themeColor = '#fa554f';
    res.render('prize/store/new', {currency, themeColor, user});
})

router.get('/store/:id/edit', catchAsync(async (req, res) => {
    const prize = await PiggyModel.findById(req.params.id);
    const currency = await Currency.find({});
    const user = req.cookies;
    const themeColor = '#fa554f';
    res.render('prize/store/edit', {prize, currency, themeColor, user});
}));

router.get('/inventory', catchAsync(async (req, res) => {
    const prizes = await Inventory.find({}).sort({priority: 1, date: -1});
    const currency = await Currency.find({});
    const user = req.cookies;
    const themeColor = '#7B542C';
    res.render('prize/inventory', {prizes, currency, themeColor, user});
}))

router.put('/inventory/sent/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    const curInventory = await Inventory.findById(id);
    if (curInventory.main) {
        await Inventory.findByIdAndUpdate(id, {main: false, secondary: false, priority: 2});
    } else {
        await Inventory.findByIdAndUpdate(id, {main: true, secondary: false, priority: 1});
    }
    res.redirect(`/prize/inventory`);
}))

router.put('/inventory/received/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    const curInventory = await Inventory.findById(id);
    if (curInventory.secondary) {
        await Inventory.findByIdAndUpdate(id, {main: false, secondary: false, priority: 2});
    } else {
        await Inventory.findByIdAndUpdate(id, {main: true, secondary: true, priority: 0, receivedDate: new Date()});
    }
    res.redirect(`/prize/inventory`);
}))

module.exports = router;