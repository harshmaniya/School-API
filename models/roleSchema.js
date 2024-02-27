const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roleSchema = new Schema({
    roleName: {
        type: String,
        enum: ['admin', 'faculty', 'student']
    }
})

const Role = mongoose.model('role', roleSchema)
module.exports = Role;