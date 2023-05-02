// This file goona import data that are present in the 
// tours-simple.json file..
// This is a indepent file so, this file doesn't have any conncection
// To our express application..
// I want it will run once when I started the server, and load all the data
// The data that are present inside the tours-simple.json file will be imported..
// So I have to start server from here and import the file..


const fs = require('fs');
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({ path: './config.env' })
const app = require('../../app');
const Tour = require('../../models/tourModel')

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWARD)

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log("DB connection successful"))

const tour = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));


// Importing data..
const importData = async () => {
  try {
    // Direct convert to the schema models..
    const data = await Tour.create(tour);
    console.log('Data load Successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();

}

// Delete data..
const deleteData = async () => {
  try {
    const data = await Tour.deleteMany();
    console.log('Data deleted Successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

// It is a specific command...
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Your server is listening to you sir.. ${PORT}...`);
});
