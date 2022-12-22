const Currency = require('../models/currency');
const Inventory = require('../models/inventory');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const themecolor = '#7B542C';

router.get('/inventory', catchAsync(async (req, res) => {
    const inventories = await Inventory.find({}).sort({priority: 1, date: -1});
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('prize/inventory', {inventories, currency, themecolor, user});
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