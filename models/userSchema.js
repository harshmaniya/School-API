const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,        
        trim: true
    },
    lastName: {
        type: String,       
        trim: true
    },
    email: {
        type: String,       
        trim: true,
        lowercase: true
    },
    gender: {
        type: String,
        lowercase: true,
        enum: ['male', 'female'],
        trim: true

    },
    role: {
        type: mongoose.Schema.ObjectId,
        ref: "role"
    },
    class: {
        type: mongoose.Schema.ObjectId,
        ref: "class"
    },
    subject: {
        type: mongoose.Schema.ObjectId,
        ref: "subject"
    },
    enrNo: {
        type: Number
    },
    password: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    },
    updatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    }
})

userSchema.methods.generateAccessToken = async function () {
    const userObject = { ...this.toObject() }
    return jwt.sign(
        userObject,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    )
}

userSchema.pre('save', async function (next) {
    if (!this.password) return next()
    if (this.isModified('password')) {
        try {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        } catch (error) {
            return next(error);
        }
    }
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('user', userSchema)
module.exports = User