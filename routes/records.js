const express = require('express'); 
const router = express.Router();
const { schema } = require('../schema');
const record = require('../models/record');
const user = require('../models/user');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync.js');


// middlewares 
const validateRecord = (req, res, next) => {
    let {error} = schema.validate(req.body);
    if(error){
        let errorMessage = error.details.map(el => el.message).join(', ');
        const err = new ExpressError(errorMessage, 400);
        throw err;
    } else{
    next();
}};

// check viewer 
const checkViewer = (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === 'Viewer'){
    req.flash('error', 'Only Admin can see records.');
    return res.redirect(`/users/${req.user._id}`);    
}else
    next();
};

const checkAnalyst = (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === 'Analyst'){
    req.flash('error', 'Only Admin can edit records.');
    return res.redirect(`/records`);    
}else
    next();
};

// get all records for Analyst  
router.get(
    '/',
    wrapAsync(async (req, res)=>{
        // if(!req.isAuthenticated()){
        //     req.flash('error', 'You must be logged in to view records.');
        //     return res.redirect('/login');
        // }
    const records = await record.find({}).populate('user', 'username');
    const users = await user.find({});
    res.render('records/record.ejs',{records,users });
}));

    //  get form to create new record
router.get('/create',checkAnalyst,checkViewer,wrapAsync(async (req, res)=>{
        const users = await user.find({});
        res.render('records/create.ejs',{users});
   
}));
    
    

//  create a new record
router.post('/',checkAnalyst,checkViewer,wrapAsync(async (req, res, next)=>{
        const { amount, type, category, notes ,username  } = req.body;
    const userId = await user.findOne({ username: username });
    const newRecord = new record({ amount, type, category, notes, user: userId._id });
    await newRecord.save();
    req.flash('success', 'Record created successfully!');
    res.redirect('/records');
       
}));

// get form to update a record 
router.get('/:id/edit', checkAnalyst, checkViewer, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const recordToEdit = await record.findById({ _id: id }).populate('user', 'username');

    res.render('records/edit.ejs', { recordToEdit });
}));

// update a record
router.put('/:id', checkAnalyst, checkViewer, wrapAsync(async (req, res) => {
    const { amount, type, category, notes, username} = req.body;
    const userId = await user.findOne({ username: username });

   if(!amount && !type && !username) {
         const err = new ExpressError('Amount, Type and Username are required fields', 400);
       throw err;
    }
    const { id } = req.params;
    const updatedRecord = await record.findByIdAndUpdate(id, { amount, type, category, notes, user: userId }, { returnDocument: 'after' });
    req.flash('success', 'Record updated successfully!');

    res.redirect('/records');
}));

// delete a record
router.delete('/:id', checkAnalyst, checkViewer, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await record.findByIdAndDelete({ _id: id });
    req.flash('success', 'Record deleted successfully!');
    res.redirect('/records');
}));

module.exports = {records :router, checkViewer, checkAnalyst};