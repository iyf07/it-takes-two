const express = require('express');
const PiggyBank = require('../models/piggybank');
const PiggyModel = require('../models/piggymodel');
const Currency = require('../models/currency');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')

router.get('/', async(req, res) => {
    const piggybanks = await PiggyBank.find({});
    res.render('piggybank/piggybank', {piggybanks})
})

router.get('/newpiggy', async(req, res) => {
    const piggymodels = await PiggyModel.find({});
    res.render('piggybank/newpiggy', {piggymodels})
})

router.get('/newbonuspiggy',async(req, res) => {
    res.render('piggybank/newbonuspiggy')
})

router.get('/piggymodel', async(req, res) => {
    const piggymodels = await PiggyModel.find({});
    res.render('piggybank/piggymodel', {piggymodels})
})

router.get('/resetpoints', async(req, res) => {
    await Currency.deleteMany({});
    const currency = new Currency({potatoes: 0, watermelons: 0, eggs: 0})
    await currency.save()
})

router.post('/', catchAsync(async(req, res) => {
    let newData = req.body.piggybank;
    const data = await PiggyModel.findById(req.body.piggybankid);
    if(data){
        newData.name = data.name;
        newData.points = data.points;
        newData.currency = data.currency;
    }
    const piggy = new PiggyBank(newData);
    await piggy.save();
    res.redirect(`/piggybank/${piggy._id}`)
}))

router.post('/piggymodel', catchAsync(async(req, res) => {
    const piggy = new PiggyModel(req.body.piggymodel);
    await piggy.save();
    res.redirect(`/piggybank/piggymodel`)
}))

router.get('/piggymodel/newmodel', (req, res) => {
    res.render('piggybank/newmodel')
})

router.get('/:id', catchAsync(async(req, res) => {
    const piggybank = await PiggyBank.findById(req.params.id)
    res.render('piggybank/showpiggy', {piggybank})
}));

router.get('/:id/edit', catchAsync(async(req, res) => {
    const piggybank = await PiggyBank.findById(req.params.id)
    res.render('piggybank/editpiggy', {piggybank})
}));

router.get('/piggymodel/:id/edit', catchAsync(async(req, res) => {
    const piggymodel = await PiggyModel.findById(req.params.id)
    res.render('piggybank/editmodel', {piggymodel})
}));

router.put('/piggymodel/:id', catchAsync(async(req, res) => {
    const {id} =req.params;
    const piggymodel = await PiggyModel.findByIdAndUpdate(id, {...req.body.piggymodel})
    res.redirect(`/piggybank/piggymodel`)
}));

router.put('/:id/:status', catchAsync(async(req, res) => {
    let operation = 1;
    if(req.params.status.slice(0,-2)==="Bacon"){
        operation = -1;
    }
    const {id} =req.params;
    const piggydata = await PiggyBank.findById(id);
    const allcurrencydata = await Currency.find({});
    const currencydataid = allcurrencydata[0]._id;
    const updatecurrency = piggydata.currency.slice(0, -2);
    const updatepoints = piggydata.points;
    const currencydata = await Currency.findById(currencydataid);
    const currentpoints = currencydata[updatecurrency];
    const obj = {};
    obj[updatecurrency] = currentpoints + operation * updatepoints;
    await Currency.findByIdAndUpdate(currencydataid, obj);
    const piggybank = await PiggyBank.findByIdAndUpdate(id, {status: req.params.status})
    res.redirect(`/piggybank/${piggybank._id}`)
}));

router.put('/:id', catchAsync(async(req, res) => {
    const {id} =req.params;
    const piggybank = await PiggyBank.findByIdAndUpdate(id, {...req.body.piggybank})
    res.redirect(`/piggybank/${piggybank._id}`)
}));

router.delete('/:id', catchAsync(async(req,res) => {
    const {id} = req.params;
    await PiggyBank.findByIdAndDelete(id);
    res.redirect('/piggybank')
}));

router.delete('/piggymodel/:id', catchAsync(async(req,res) => {
    const {id} = req.params;
    await PiggyModel.findByIdAndDelete(id);
    res.redirect('/piggybank/piggymodel')
}));

module.exports = router;