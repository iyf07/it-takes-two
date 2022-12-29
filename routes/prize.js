const Currency = require('../models/currency');
const Inventory = require('../models/inventory');
const Store = require('../models/store');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const PiggyBank = require("../models/piggy-bank");

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
    res.render('prize/new', {currency, themeColor, user});
})

router.get('/store/:id/edit', catchAsync(async (req, res) => {
    const prize = await Store.findById(req.params.id);
    const currency = await Currency.find({});
    const user = req.cookies;
    const themeColor = '#fa554f';
    res.render('prize/edit', {prize, currency, themeColor, user});
}));

router.get('/inventory', catchAsync(async (req, res) => {
    const prizes = await Inventory.find({}).sort({priority: 1, date: -1});
    const currency = await Currency.find({});
    const user = req.cookies;
    const themeColor = '#7B542C';
    res.render('prize/inventory', {prizes, currency, themeColor, user});
}))

router.post('/store/:id/redeem', catchAsync(async (req, res) => {
    const prize = await Store.findById(req.params.id);
    const allCurrencyData = await Currency.find({});
    const inventory = new Inventory({
        name: prize.name,
        game: 'Store',
        date: new Date(),
        receivedDate: new Date(),
        main: false,
        secondary: false,
        priority: 2
    });
    const prizeCurrency = prize.currency.slice(0, -2);
    const prizePoints = prize.points;
    let obj = {};
    await inventory.save();
    switch (prizeCurrency) {
        case 'potatoes':
            obj[prizeCurrency] = allCurrencyData[0].potatoes - prizePoints;
            break;
        case 'watermelons':
            obj[prizeCurrency] = allCurrencyData[0].watermelons - prizePoints;
            break;
        case 'eggs':
            obj[prizeCurrency] = allCurrencyData[0].eggs - prizePoints;
            break;
    }
    await Currency.findByIdAndUpdate(allCurrencyData[0]._id, obj);
    res.redirect(`/prize/store`)
}));

router.post('/store', catchAsync(async (req, res) => {
    let priority = 0;
    switch (req.body.prize.currency.slice(0, -2)) {
        case 'potatoes':
            break;
        case 'watermelons':
            priority += 1000;
            break;
        case 'eggs':
            priority += 10000;
            break;
    }
    priority += Number(req.body.prize.points);
    let newData = req.body.prize;
    newData.priority = priority;
    const prize = new Store(newData);
    await prize.save();
    res.redirect(`/prize/store`);
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

router.put('/store/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const currentPrize = await Store.findById(id);
    const currentCurrency = currentPrize.currency;
    let newPrize = req.body.prize;
    let newPriority = currentPrize.priority;
    switch (currentCurrency.slice(0, -2)) {
        case 'potatoes':
            break;
        case 'watermelons':
            newPriority -= 1000;
            break;
        case 'eggs':
            newPriority -= 10000;
            break;
    }
    switch (req.body.prize.currency.slice(0, -2)) {
        case 'potatoes':
            break;
        case 'watermelons':
            newPriority += 1000;
            break;
        case 'eggs':
            newPriority += 10000;
            break;
    }
    newPrize.priority = newPriority;
    await Store.findByIdAndUpdate(id, {...newPrize});
    res.redirect(`/prize/store`);
}));

router.delete('/store/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Store.findByIdAndDelete(id);
    res.redirect(`/prize/store`);
}));

module.exports = router;