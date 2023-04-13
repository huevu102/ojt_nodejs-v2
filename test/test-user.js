var mongodb = require('../config/mongodb')
var User = require('../models/user-model')
const moment = require('moment')


async function test_insert_data() {
    await mongodb.waitForDbConnection();

    let user0 = new User({
        email: "test0@gmail.com",
        password: "onlyfortesting0",
        name: "Test0",
        salt: Date.now()
    });
    await user0.save();

    let user1 = new User({
        email: "test@gmail.com",
        password: "onlyfortesting",
        name: "Test",
        salt: Date.now()
    });
    await user1.save();

    let user2 = new User({
        email: "test02@gmail.com",
        password: "onlyfortesting02",
        name: "Test02",
        salt: Date.now()
    });

    await user2.save();

    let user3 = new User({
        email: "test03@gmail.com",
        password: "onlyfortesting03",
        name: "Test03",
        salt: Date.now()
    });

    await user3.save();

    console.log("Save data success");
}
test_insert_data();


async function test_update_data() {
    await mongodb.waitForDbConnection();

    await User.updateOne(
        {email: "test@gmail.com"}, 
        {$set: {email: "test01@gmail.com", password: "onlyfortesting01", name: "Test01"}}
    )
    
    console.log("Update data success"); 
} 
test_update_data();


async function test_delete_data() {
    await mongodb.waitForDbConnection();

    await User.deleteOne({email: "test0@gmail.com"});
    
    console.log("Delete data success"); 
} 
test_delete_data();

