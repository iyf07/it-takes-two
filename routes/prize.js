const Currency = require('../models/currency');
const Inventory = require('../models/inventory');
const Store = require('../models/store');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const PiggyModel = require("../models/piggy-model");
const themeColorInventory = '#7B542C';
const themeColorStore = '#fa554f';

router.get('/store', catchAsync(async (req, res) => {
    const prizes = await Store.find({}).sort({priority: 1});
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('prize/store', {prizes, currency, themeColorStore, user});
}))

router.get('/store/new-prize', async (req, res) => {
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('prize/store/new', {currency, themeColorStore, user});
})

router.get('/store/:id/edit', catchAsync(async (req, res) => {
    const prize = await PiggyModel.findById(req.params.id);
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('prize/store/edit', {prize, currency, themeColorStore, user});
}));

router.get('/inventory', catchAsync(async (req, res) => {
    const inventories = await Inventory.find({}).sort({priority: 1, date: -1});
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('prize/inventory', {inventories, currency, themeColorInventory, user});
}))

router.put('/inventory/sent/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    const curinventory = await Inventory.findById(id);
    if (curinventory.main) {
        await Inventory.findByIdAndUpdate(id, {main: false, secondary: false, priority: 2});
    } else {
        await Inventory.findByIdAndUpdate(id, {main: true, secondary: false, priority: 1});
    }
    res.redirect(`/prize/inventory`);
}))

router.put('/inventory/received/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    const curinventory = await Inventory.findById(id);
    if (curinventory.secondary) {
        await Inventory.findByIdAndUpdate(id, {main: false, secondary: false, priority: 2});
    } else {
        await Inventory.findByIdAndUpdate(id, {main: true, secondary: true, priority: 0, receivedate: new Date()});
    }
    res.redirect(`/prize/inventory`);
}))

module.exports = router;