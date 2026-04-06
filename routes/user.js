const express = require('express');
const router = express.Router();
const { uSchema } = require('../schema');
const record = require('../models/record');
const user = require('../models/user');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync.js');
const { checkViewer, checkAnalyst } = require('./records');
// middlewares
const validateUser = (req, res, next) => {
    let {error} = uSchema.validate(req.body);
    if(error){
        let errorMessage = error.details.map(el => el.message).join(', ');
        const err = new ExpressError(errorMessage, 400);
        throw err;
    } else{
    next();
}};

router.get('/signup',checkViewer,checkAnalyst, (req, res)=>{
    res.render('signup.ejs');
});
router.post('/signup', validateUser,checkViewer,checkAnalyst, wrapAsync(async (req, res) => {
try{
    let { username, email, role , password} = req.body;
 const newUser = new user({ username, email, role });
 const registered = await user.register(newUser, password);
req.flash('success', 'User created successfully!');
res.redirect('/records');
}catch(e){
    req.flash('error', e.message);
}
}));

router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;

    const dashboard = await user.findById(id);

    if (!dashboard) {
        req.flash('error', 'User not found');
        return res.redirect('/records');

    }

    const records = await record.find({ user: id });

   
    let totalIncome = 0;
    let totalExpense = 0;
    let categoryTotals = {};

    records.forEach(r => {
        if (r.type === "Income") {
            totalIncome += r.amount;
        } else {
            totalExpense += r.amount;
        }

        if (!categoryTotals[r.category]) {
            categoryTotals[r.category] = 0;
        }
        categoryTotals[r.category] += r.amount;
    });

    const netBalance = totalIncome - totalExpense;

   
    const recentRecords = records
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5);

   
    res.render('records/dashboard.ejs', {
        dashboard,
        totalIncome,
        totalExpense,
        netBalance,
        categoryTotals,
        recentRecords,
        records
    });
}));






router.post('/',validateUser ,checkViewer,checkAnalyst, wrapAsync(async (req, res) => {
    const { username, email, role } = req.body;
    if(!username && !email)  {
        req.flash('error', 'enter all details');
        return res.redirect('/records');
    }
    

    const Usermail = await user.findOne({ email: email});
    const Userid = await user.findOne({ username : username});
    if(Userid == null && Usermail == null){
        const newUser = new user({ username, email, role });
        await newUser.save();
            req.flash('success', 'User created successfully!');
        res.redirect('/records');

    }else{
    throw new ExpressError('Email or user already exists', 400);
    }
 
}));

// get to update user 
router.get('/:id/edit',checkViewer,checkAnalyst, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const userToEdit = await user.findById({ _id: id });
    res.render('users/edit.ejs', { userToEdit });
}));

// update user
router.put('/:id/edit', checkViewer, checkAnalyst, wrapAsync(async (req, res) => {
     const { id } = req.params;
        const userToUpdate = await user.findById({ _id: id });
    const {username , email , role } = req.body;
      if(!username && !email)  {
        req.flash('error', 'Enter field');
        return res.redirect(`/users/${id}/edit`);
    }
     if(userToUpdate.username == username && userToUpdate.email == email && role) {
        await user.findByIdAndUpdate({ _id: id }, { username, email, role } ,{returnDocument: 'after'});
        req.flash('success', 'User updated successfully!');
        res.redirect('/records');
    }else{
        req.flash('error', 'Do not edit username or email');
        
    }
  
}));

// delete User 
router.delete('/:id',checkViewer,checkAnalyst, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedUser = await user.findByIdAndDelete({ _id: id });
    req.flash('success', 'User deleted successfully!');
    res.redirect('/records');
}));

module.exports = router;