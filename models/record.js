const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required: true,
        min: [0, 'Amount cannot be negative']
    },
    type:{
        enum: ['Expense', 'Income'],
        type: String,
        required: true
    },
    category:{
        type:String,
        default: 'Not Specified',
        set: (v)=> v === "" ? 'Not Specified' : v
    },
    notes:{
        type:String,
        default: 'Personal',
        set: (v)=> v === "" ? 'Personal' : v
    },
     user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
   
},
    { timestamps: true }
);

module.exports = mongoose.model('Record', recordSchema);