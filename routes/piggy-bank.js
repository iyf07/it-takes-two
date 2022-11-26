const express = require('express');
const PiggyBank = require('../models/piggy-bank');
const PiggyModel = require('../models/piggy-model');
const Currency = require('../models/currency');
const User = require('../models/user')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')

router.get('/', async(req, res) => {
    const piggybanks = await PiggyBank.find({}).sort({date:-1});
    const currency = await Currency.find({});
    res.render('piggy-bank/piggy-bank', {piggybanks, currency})
})

router.get('/new-piggy', async(req, res) => {
    const piggymodels = await PiggyModel.find({}).sort({priority: 1});
    const currency = await Currency.find({});
    res.render('piggy-bank/new-piggy', {piggymodels, currency})
})

router.get('/new-bonus-piggy',async(req, res) => {
    const currency = await Currency.find({});
    res.render('piggy-bank/new-bonus-piggy', {currency})
})

router.get('/piggy-model', async(req, res) => {
    const piggymodels = await PiggyModel.find({}).sort({priority:1});
    const currency = await Currency.find({});
    res.render('piggy-bank/piggy-model', {piggymodels, currency})
})

router.get('/piggy-model/new-model', async(req, res) => {
    const currency = await Currency.find({});
    const code = '';
    res.render('piggy-bank/new-model', {currency, code})
})

router.get('/piggy-model/new-model/admin/:code', async(req, res) => {
    const currency = await Currency.find({});
    const users = await User.find({});
    const code = req.params.code;
    res.render('piggy-bank/new-model', {currency, users, code})
})

router.get('/piggy-model/:id/edit', catchAsync(async(req, res) => {
    const piggymodel = await PiggyModel.findById(req.params.id)
    const currency = await Currency.find({});
    res.render('piggy-bank/edit-model', {piggymodel, currency})
}));

router.get('/:id', catchAsync(async(req, res) => {
    const piggybank = await PiggyBank.findById(req.params.id)
    const currency = await Currency.find({});
    const code = '';
    res.render('piggy-bank/show-piggy', {piggybank, currency, code})
}));

router.get('/:id/admin/:code', catchAsync(async(req, res) => {
    const piggybank = await PiggyBank.findById(req.params.id)
    const currency = await Currency.find({});
    const users = await User.find({});
    const code = req.params.code;
    res.render('piggy-bank/show-piggy', {piggybank, currency, code, users})
}));

router.get('/:id/edit', catchAsync(async(req, res) => {
    const piggybank = await PiggyBank.findById(req.params.id)
    const piggymodels = await PiggyModel.find({}).sort({priority: 1});
    const currency = await Currency.find({});
    switch(piggybank.type){
        case 'normal':
            res.render('piggy-bank/edit-piggy', {piggybank, currency, piggymodels});
            break;
        case 'bonus':
            res.render('piggy-bank/edit-bonus-piggy', {piggybank, currency, piggymodels});
            break;
    }
}));

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
    res.redirect(`/piggy-bank/${piggy._id}`)
}))

router.post('/piggy-model', catchAsync(async(req, res) => {
    let priority = 0;
    switch(req.body.piggymodel.currency.slice(0,-2)){
        case 'potatoes':
            break;
        case 'watermelons':
            priority += 1000;
            break;
        case 'eggs':
            priority += 10000;
            break;
    }
    priority += Number(req.body.piggymodel.points);
    let newData = req.body.piggymodel;
    newData.priority = priority
    const piggy = new PiggyModel(newData);
    await piggy.save();
    res.redirect(`/piggy-bank/piggy-model`)
}))

router.put('/piggy-model/:id', catchAsync(async(req, res) => {
    const {id} =req.params;
    await PiggyModel.findByIdAndUpdate(id, {...req.body.piggymodel})
    res.redirect(`/piggy-bank/piggy-model`)
}));

router.put('/:id/:status/:code', catchAsync(async(req, res) => {
    let operation = 1;
    const {id} =req.params;
    const piggydata = await PiggyBank.findById(id);
    const allcurrencydata = await Currency.find({});
    const currencydataid = allcurrencydata[0]._id;
    const updatecurrency = piggydata.currency.slice(0, -2);
    const updatepoints = piggydata.points;
    const currencydata = await Currency.findById(currencydataid);
    const currentpoints = currencydata[updatecurrency];
    const currentstatus = piggydata.status;
    if(req.params.status.slice(0,-2).toLowerCase()==="bacon"){
        operation = -1;
        if(currentstatus.slice(0,-2).toLowerCase()==="piglet"){
            operation = 0;
        }
    }
    if(req.params.status.slice(0,-2).toLowerCase()==="piglet"){
        operation = 0;
    }
    const obj = {};
    obj[updatecurrency] = currentpoints + operation * updatepoints;
    switch(updatecurrency){
        case "potatoes":
            if(obj[updatecurrency]>100){
                obj[updatecurrency]=100
            }else if(obj[updatecurrency]<0 ){
                obj[updatecurrency]=0
            }
            break
        case "watermelons":
            if(obj[updatecurrency]>50){
                obj[updatecurrency]=50
            }else if(obj[updatecurrency]<0){
                obj[updatecurrency]=0
            }
            break
        case "eggs":
            if(obj[updatecurrency]>10){
                obj[updatecurrency]=10
            }else if(obj[updatecurrency]<0){
                obj[updatecurrency]=0
            }
            break
    }
    await Currency.findByIdAndUpdate(currencydataid, obj);
    const piggybank = await PiggyBank.findByIdAndUpdate(id, {status: req.params.status})
    if(req.params.code==='null'){
        res.redirect(`/piggy-bank/${piggybank._id}`)
    }else{
        res.redirect(`/piggy-bank/${piggybank._id}/admin/${req.params.code}`)
    }
}));

router.put('/:id', catchAsync(async(req, res) => {
    const {id} =req.params;
    const piggybank = await PiggyBank.findByIdAndUpdate(id, {...req.body.piggybank})
    res.redirect(`/piggy-bank/${piggybank._id}`)
}));

router.delete('/:id', catchAsync(async(req,res) => {
    const {id} = req.params;
    await PiggyBank.findByIdAndDelete(id);
    res.redirect('/piggy-bank')
}));

router.delete('/piggy-model/:id', catchAsync(async(req,res) => {
    const {id} = req.params;
    await PiggyModel.findByIdAndDelete(id);
    res.redirect('/piggy-bank/piggy-model')
}));

module.exports = router;