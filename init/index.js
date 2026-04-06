const mongoose = require('mongoose');
const Data = require('./data.js');
const record = require('../models/record.js');
const user = require('../models/user.js');
// connect to MongoDB
main().then(()=>{
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect('mongodb://localhost:27017/fianance-zorvyn');
}

// const initDB = async () => {
//     await record.deleteMany({});
//     await record.insertMany(Data.data);
//     console.log('Database initialized ');
        
// }
// initDB();

const initDB = async () => {
    await record.deleteMany({});
    await user.deleteMany({});

    const newUser = await user.create({
        username: "tanya",
        email: "tanya@gmail.com",
        role: "Admin"
    });

    const updatedData = Data.data.map(obj => ({
        ...obj,
        user: newUser._id
    }));

    await record.insertMany(updatedData);

    console.log("Database initialized");
};
initDB();
main();


      


