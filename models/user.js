const mongoose = require('mongoose');
const record = require('./record.js');
const passportLocalMongoose = require('passport-local-mongoose').default;

const userSchema = new mongoose.Schema({
  
    email:{
        type: String,
       // required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['Viewer', 'Analyst', 'Admin'], 
      //  required: true,
        default: 'Viewer' 
    }
},
{ timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

userSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await record.deleteMany({ user: doc._id });
    }
});



module.exports = mongoose.model("User", userSchema);