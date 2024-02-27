const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subjectSchema = new Schema({
    subjectName: {
        type: String,       
        require: true,
        trim: true
    },
    subjectCode: {
        type: String,      
        require: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})


const Subject = mongoose.model('subject', subjectSchema)
module.exports = Subject;