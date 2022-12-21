const express = require('express');
const Currency = require('../models/currency');
const Inventory = require('../models/inventory')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const themecolor = '#7B542C';

router.get('/inventory', catchAsync(async(req, res) => {
    const inventories = await Inventory.find({}).sort({priority: 1, date:-1});
    let currency = await Currency.find({});
    const user = req.cookies;
    res.render('prize/inventory', {inventories, currency, themecolor, user});
}))

router.put('/inventory/sent/:id', catchAsync(async(req, res) => {
    const id = req.params.id;
    const curinventory = await Inventory.findById(id)
    const curpriority = curinventory.priority;
    let newpriority = -1;
    let newmain = true;
    if(curinventory.main) {
        newmain = false;
        newpriority = 1;
    }
    await Inventory.findByIdAndUpdate(id, {main: newmain, priority: curpriority + newpriority})
    res.redirect(`/prize/inventory`)
}))

router.put('/inventory/received/:id', catchAsync(async(req, res) => {
    const id = req.params.id;
    const curinventory = await Inventory.findById(id)
    let newsecondary = true;
    if(curinventory.secondary) {
        newsecondary = false;
    }
    await Inventory.findByIdAndUpdate(id, {secondary: newsecondary})
    res.redirect(`/prize/inventory`)
}))



module.exports = router;