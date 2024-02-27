const mongoose = require('mongoose')
const Schema = mongoose.Schema

const topperSchema = new Schema({
    class: {
        type: mongoose.Schema.ObjectId,
        ref: 'class'
    },
    noOfFailStudents: {
        type: Number
    },
    noOfPassStudents: {
        type: Number
    },
    highestScores: [{
        student: {
            type: mongoose.Schema.ObjectId,
            ref: 'user'
        },
        percentage: {
            type: Number
        },
        grade: {
            type: String,
            enum: ['pass', 'fail']
        }
    }]
})

const Topper = mongoose.model('topper', topperSchema)
module.exports = Topper;