const mongoose = require('mongoose')
const Schema = mongoose.Schema

const classSchema = new Schema({
    className: {
        type: String,
        require: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})


const Class = mongoose.model('class', classSchema)
module.exports = Class;