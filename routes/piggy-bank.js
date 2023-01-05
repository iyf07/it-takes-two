const PiggyBank = require('../models/piggy-bank');
const PiggyModel = require('../models/piggy-model');
const Currency = require('../models/currency');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const themeColor = '#fce7d8';

router.get('/', async (req, res) => {
    const piggyBanks = await PiggyBank.find({}).sort({priority: -1, date: -1});
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('piggy-bank/piggy-bank', {piggyBanks, currency, themeColor, user});
})

router.get('/new-piggy', async (req, res) => {
    const piggyModels = await PiggyModel.find({}).sort({priority: 1});
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('piggy-bank/new-piggy', {piggyModels, currency, themeColor, user});
})

router.get('/new-bonus-piggy', async (req, res) => {
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('piggy-bank/new-bonus-piggy', {currency, themeColor, user});
})

router.get('/piggy-model', async (req, res) => {
    const piggyModels = await PiggyModel.find({}).sort({priority: 1});
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('piggy-bank/piggy-model', {piggyModels, currency, themeColor, user});
})

router.get('/piggy-model/new-model', async (req, res) => {
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('piggy-bank/new-model', {currency, themeColor, user});
})

router.get('/piggy-model/:id/edit', catchAsync(async (req, res) => {
    const piggyModel = await PiggyModel.findById(req.params.id);
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('piggy-bank/edit-model', {piggyModel, currency, themeColor, user});
}));

router.get('/:id', catchAsync(async (req, res) => {
    const piggyBank = await PiggyBank.findById(req.params.id);
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('piggy-bank/show-piggy', {piggyBank, currency, themeColor, user});
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const piggyBank = await PiggyBank.findById(req.params.id);
    const piggyModels = await PiggyModel.find({}).sort({priority: 1});
    const currency = await Currency.find({});
    const user = req.cookies;
    switch (piggyBank.type) {
        case 'normal':
            res.render('piggy-bank/edit-piggy', {piggyBank, currency, piggyModels, themeColor, user});
            break;
        case 'bonus':
            res.render('piggy-bank/edit-bonus-piggy', {piggyBank, currency, piggyModels, themeColor, user});
            break;
    }
}));

router.post('/', catchAsync(async (req, res) => {
    const data = await PiggyModel.findById(req.body.piggyBankId);
    let newData = req.body.piggyBank;
    if (data) {
        newData.name = data.name;
        newData.points = data.points;
        newData.currency = data.currency;
    }
    const piggy = new PiggyBank(newData);
    await piggy.save();
    res.redirect(`/piggy-bank/${piggy._id}`);
}))

router.post('/piggy-model', catchAsync(async (req, res) => {
    let priority = 0;
    switch (req.body.piggyModel.currency.slice(0, -2)) {
        case 'potatoes':
            break;
        case 'watermelons':
            priority += 1000;
            break;
        case 'eggs':
            priority += 10000;
            break;
    }
    priority += Number(req.body.piggyModel.points);
    let newData = req.body.piggyModel;
    newData.priority = priority;
    const piggy = new PiggyModel(newData);
    await piggy.save();
    res.redirect(`/piggy-bank/piggy-model`);
}))

router.put('/piggy-model/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const currentModel = await PiggyModel.findById(id);
    const currentCurrency = currentModel.currency;
    let newModel = req.body.piggyModel;
    let newPriority = currentModel.priority;
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
    switch (req.body.piggyModel.currency.slice(0, -2)) {
        case 'potatoes':
            break;
        case 'watermelons':
            newPriority += 1000;
            break;
        case 'eggs':
            newPriority += 10000;
            break;
    }
    newModel.priority = newPriority;
    await PiggyModel.findByIdAndUpdate(id, {...newModel});
    res.redirect(`/piggy-bank/piggy-model`);
}));

router.put('/:id/:status', catchAsync(async (req, res) => {
    const {id} = req.params;
    const piggyData = await PiggyBank.findById(id);
    const piggyModels = await PiggyModel.find({});
    const allCurrencyData = await Currency.find({});
    const currencyDataId = allCurrencyData[0]._id;
    const updateCurrency = piggyData.currency.slice(0, -2);
    const updatePoints = piggyData.points;
    const currencyData = await Currency.findById(currencyDataId);
    const currentPoints = currencyData[updateCurrency];
    const currentStatus = piggyData.status;
    let obj = {};
    let operation = 1;
    let newExp;
    if (req.params.status.slice(0, -2).toLowerCase() === 'bacon') {
        operation = -1;
        if (currentStatus.slice(0, -2).toLowerCase() === 'piglet') {
            operation = 0;
        }
    }
    if (req.params.status.slice(0, -2).toLowerCase() === 'piglet') {
        operation = 0;
    }
    obj[updateCurrency] = currentPoints + operation * updatePoints;
    // switch (updateCurrency) {
    //     case 'potatoes':
    //         obj[updateCurrency] = Math.min(obj[updateCurrency], 100);
    //         break;
    //     case 'watermelons':
    //         obj[updateCurrency] = Math.min(obj[updateCurrency], 50);
    //         break;
    //     case 'eggs':
    //         obj[updateCurrency] = Math.min(obj[updateCurrency], 10);
    //         break;
    // }
    switch (req.params.status.slice(0, -2).toLowerCase()) {
        case 'bacon':
            await PiggyBank.findByIdAndUpdate(id, {priority: 2});
            for (let piggyModel of piggyModels) {
                if (piggyModel.name.toLowerCase() === piggyData.name.toLowerCase() && currentStatus === 'piggy') {
                    newExp = piggyModel.exp - 1;
                    let newLev = Math.floor(newExp / 10);
                    await PiggyModel.findByIdAndUpdate(piggyModel._id, {exp: newExp, level: newLev});
                }
            }
            break;
        case 'piggy':
            await PiggyBank.findByIdAndUpdate(id, {priority: 0});
            for (let piggyModel of piggyModels) {
                if (piggyModel.name.toLowerCase() === piggyData.name.toLowerCase()) {
                    newExp = piggyModel.exp + 1;
                    let newLev = Math.floor(newExp / 10);
                    await PiggyModel.findByIdAndUpdate(piggyModel._id, {exp: newExp, level: newLev});
                }
            }
            break;
    }
    await Currency.findByIdAndUpdate(currencyDataId, obj);
    await PiggyBank.findByIdAndUpdate(id, {status: req.params.status});
    res.redirect(`/piggy-bank/${id}`);
}));

router.put('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const allCurrencyData = await Currency.find({});
    const currencyDataId = allCurrencyData[0]._id;
    const currentPiggy = await PiggyBank.findById(id);
    const piggyCurrency = currentPiggy.currency.slice(0, -2).toLowerCase();
    const piggyPoints = currentPiggy.points;
    const currentStatus = currentPiggy.status.slice(0, -2).toLowerCase();
    let obj = {};
    switch (currentStatus) {
        case 'piggy':
            switch (piggyCurrency) {
                case 'potatoes':
                    obj[piggyCurrency] = allCurrencyData[0].potatoes - piggyPoints;
                    break;
                case 'watermelons':
                    obj[piggyCurrency] = allCurrencyData[0].watermelons - piggyPoints;
                    break;
                case 'eggs':
                    obj[piggyCurrency] = allCurrencyData[0].eggs - piggyPoints;
                    break;
            }
            await Currency.findByIdAndUpdate(currencyDataId, obj);
    }
    await PiggyBank.findByIdAndUpdate(id, {...req.body.piggyBank});
    res.redirect(`/piggy-bank/${id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await PiggyBank.findByIdAndDelete(id);
    res.redirect(`/piggy-bank`);
}));

router.delete('/piggy-model/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await PiggyModel.findByIdAndDelete(id);
    res.redirect(`/piggy-bank/piggy-model`);
}));

module.exports = router;