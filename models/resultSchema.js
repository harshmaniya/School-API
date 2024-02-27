const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const resultSchema = new Schema({
    faculty: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        require: true
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        require: true
    },
    class: {
        type: mongoose.Schema.ObjectId,
        ref: 'class',
        require: true
    },
    scores: [
        {
            subject: {
                type: mongoose.Schema.ObjectId,
                ref: 'subject',
                required: true
            },
            total: {
                type: Number,
                required: true
            },
            marksObtained: {
                type: Number,
                required: true
            }
        }
    ],
    isDeleted : {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

resultSchema.virtual('totalSubjectMarks').get(function () {
    let totalSubjectMarks = 0;
    for(const score of this.scores) {
        totalSubjectMarks += score.total;
    }
    return totalSubjectMarks;
});

resultSchema.virtual('totalObtainMarks').get(function () {
    let totalObtainMarks = 0;
    for(const score of this.scores) {
        totalObtainMarks += score.marksObtained;
    }
    return totalObtainMarks;
});

resultSchema.virtual('result').get(function () {
    const isFail = this.scores.some(subject => subject.marksObtained < 23);

    return isFail ? 'fail' : 'pass';
});

resultSchema.virtual('grade').get(function () {
    const percentage = (this.totalObtainMarks / this.totalSubjectMarks) * 100;

    if (this.result === 'fail') {
        return 'fail';
    } else if (percentage >= 70) {
        return 'distinction';
    } else if (percentage >= 60 && percentage < 70) {
        return 'first class';
    } else if (percentage >= 50 && percentage < 60) {
        return 'second class';
    } else {
        return 'pass';
    }
});

resultSchema.virtual('percentage').get(function () {
    return (this.totalObtainMarks / this.totalSubjectMarks) * 100;
});


const Result = mongoose.model('result', resultSchema)
module.exports = Result