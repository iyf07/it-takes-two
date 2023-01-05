const Toilet = require('../models/toilet');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const PiggyBank = require("../models/piggy-bank");
const Currency = require("../models/currency");
const PiggyModel = require("../models/piggy-model");
const Store = require("../models/store");
const themeColor = '#7b5c00';

router.get('/', async (req, res) => {
    const poops = await Toilet.find({}).sort({status: 1, date: -1});
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('toilet/toilet', {poops, currency, themeColor, user});
})

router.get('/new-poop', async (req, res) => {
    const currency = await Currency.find({});
    const user = req.cookies;
    res.render('toilet/new', {currency, themeColor, user});
})

router.get('/:id/edit', async (req, res) => {
    const currency = await Currency.find({});
    const user = req.cookies;
    const poop = await Toilet.findById(req.params.id);
    res.render('toilet/edit', {poop, currency, themeColor, user});
})

router.post('/', catchAsync(async (req, res) => {
    const currency = await Currency.find({});
    const currentPoop = currency[0].poops;
    const newPoop = Math.min(currentPoop + 1, 100);
    const poop = new Toilet(req.body.poop);
    await poop.save();
    await Currency.findByIdAndUpdate(currency[0]._id, {poops:newPoop})
    res.redirect(`/toilet`);
}))

router.post('/:id/flush', catchAsync(async (req, res) => {
    const {id} = req.params;
    const currency = await Currency.find({});
    const currentPoop = currency[0].poops;
    const currentPaper = currency[0].toilet_papers;
    await Toilet.findByIdAndUpdate(id, {status: 'Inactive'});
    await Currency.findByIdAndUpdate(currency[0]._id, {poops: currentPoop-1, toilet_papers: currentPaper-1})
    res.redirect(`/toilet`);
}));

router.put('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Toilet.findByIdAndUpdate(id, {...req.body.poop});
    res.redirect(`/toilet`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Toilet.findByIdAndDelete(id);
    res.redirect(`/toilet`);
}));

module.exports = router;