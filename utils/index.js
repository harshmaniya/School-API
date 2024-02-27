const { skip } = require('graphql-resolvers')
const { User, Role } = require('../models')


const isAuthenticatedAdmin = async (_, args, user) => {
    try {
        const userData = await User.findById(user._id).populate('role', 'roleName')

        if (userData.role.roleName === "admin") {
            skip
        } else {
            return new Error('Not authenticated');
        }
    } catch (error) {
        console.error(error.message);
        return new Error('Not authenticated');
    }
}

const isAuthenticatedFaculty = async (_, args, user) => {
    try {
        const userData = await User.findById(user._id).populate('role', 'roleName')
        if (userData.role.roleName === "faculty") {
            skip
        } else {
            return new Error('Not authenticated');
        }
    } catch (error) {
        console.error(error.message);
        return new Error('Not authenticated');
    }
}

const isAuthenticatedStudent = async (_, args, user) => {
    try {
        const userData = await User.findById(user._id).populate('role', 'roleName')
        if (userData.role.roleName === "student") {
            skip
        } else {
            return new Error('Not authenticated');
        }
    } catch (error) {
        console.error(error.message);
        return new Error('Not authenticated');
    }
}

const getRoleId = async (roleName) => {
    const role = await Role.findOne({ roleName })
    return role._id
}

module.exports = { getRoleId, isAuthenticatedAdmin, isAuthenticatedStudent, isAuthenticatedFaculty }