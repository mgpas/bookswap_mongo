const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    title:String,
    genre:String,
    year:String,
    picture:String,
})

mongoose.model("book",BookSchema)