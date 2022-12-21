const express = require('express');
const Issue = require('../models/issue');
const Currency = require('../models/currency');
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const themecolor = "#929292";

router.get('/', async (req, res) => {
    const issues = await Issue.find({}).sort({order: -1}).sort({priority: -1});
    let currency = await Currency.find({});
    if(currency.length === 0){
        currency = new Currency({potatoes: 0, watermelons: 0, eggs: 0})
        await currency.save()
    }
    const user = req.cookies;
    res.render('issue/issue', {issues, currency, themecolor, user})
});

router.get('/new-issue', async(req, res) => {
    let currency = await Currency.find({});
    if(currency.length === 0){
        currency = new Currency({potatoes: 0, watermelons: 0, eggs: 0})
        await currency.save()
    }
    res.render('issue/new', {currency, themecolor})
})

router.get('/:id', catchAsync(async(req, res) => {
    const issue = await Issue.findById(req.params.id)
    let currency = await Currency.find({});
    if(currency.length === 0){
        currency = new Currency({potatoes: 0, watermelons: 0, eggs: 0})
        await currency.save()
    }
    res.render('issue/show', {issue, currency, themecolor})
}));

router.get('/:id/edit', catchAsync(async(req, res) => {
    const issue = await Issue.findById(req.params.id)
    let currency = await Currency.find({});
    if(currency.length === 0){
        currency = new Currency({potatoes: 0, watermelons: 0, eggs: 0})
        await currency.save()
    }
    res.render('issue/edit', {issue, currency, themecolor});
}));

router.post('/', catchAsync(async(req, res) => {
    const issue = new Issue(req.body.issue);
    await issue.save();
    res.redirect(`/issue`)
}))

router.put('/:id', catchAsync(async(req, res) => {
    const {id} =req.params;
    await Issue.findByIdAndUpdate(id, {...req.body.issue})
    res.redirect(`/issue`)
}));

router.put('/:id/:status', catchAsync(async(req, res) => {
    const id =req.params.id;
    const newstatus = req.params.status;
    switch(newstatus){
        case "inprogress":
            await Issue.findByIdAndUpdate(id, {order: 3})
            break;
        case "notstarted":
            await Issue.findByIdAndUpdate(id, {order : 2})
            break;
        case "completed":
            await Issue.findByIdAndUpdate(id, {order : 1})
            break;
    }
    await Issue.findByIdAndUpdate(id, {status: newstatus})
    res.redirect(`/issue`)
}));

router.delete('/:id', catchAsync(async(req,res) => {
    const {id} = req.params;
    await Issue.findByIdAndDelete(id);
    res.redirect('/issue');
}));

module.exports = router;

