const { User } = require('../../models');
const { getRoleId, isAuthenticatedFaculty, isAuthenticatedStudent } = require('../../utils');
const { combineResolvers } = require('graphql-resolvers')

// done
const createStudent = combineResolvers(isAuthenticatedFaculty,
    async (_, { input }, user) => {
        try {
            const isExist = await User.find({ email: input.email, isDeleted: false })
            console.log(isExist);
            if (isExist.length > 0) return new Error("email already exist")

            input.createdBy = user._id
            input.role = await getRoleId('student')
            input.enrNo = new Date().getTime()
            console.log(input.enrNo);
            const newStudent = await User.create(input)
            if (!newStudent) return new Error("student not created")
            console.log(newStudent);
            return newStudent
        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

// done
const updateStudent = combineResolvers(isAuthenticatedFaculty,
    async (_, { _id, input }, user) => {
        try {
            input.updatedBy = user._id
            const updateStudent = await User.findOne({ _id, isDeleted: false })
            if (!updateStudent) return new Error("student not found!")
            console.log(updateStudent);
            Object.assign(updateStudent, input);
            await updateStudent.save();
            if (!updateStudent) return new Error("getting error in student update!")
            return updateStudent
        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

// done
const deleteStudent = combineResolvers(isAuthenticatedFaculty,
    async (_, args) => {
        try {
            const { _id } = args
            const deleteStudent = await User.findOneAndUpdate({ _id, isDeleted: false }, { isDeleted: true })
            if (!deleteStudent) return new Error("getting error in student delete")
            return deleteStudent
        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

// done
const getStudent = combineResolvers(isAuthenticatedFaculty,
    async (_, args) => {
        try {
            const { _id } = args
            const getStudent = await User.findOne({ _id, isDeleted: false })
                .populate([
                    { path: 'role', select: 'roleName' },
                    { path: 'class', select: 'className' },
                    { path: 'createdBy', select: '_id firstName role' },
                    { path: 'updatedBy', select: '_id firstName role' },
                ])
                .populate([
                    { path: 'createdBy.role', model: 'Role', select: 'roleName' },
                    { path: 'updatedBy.role', model: 'Role', select: 'roleName' }
                ]);

            if (!getStudent) return new Error("getting error in finding student")
            console.log(getStudent);
            return getStudent
        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

// done
const getAllStudent = combineResolvers(isAuthenticatedFaculty,
    async () => {
        try {
            const getAllStudent = await User.find({ isDeleted: false })
                .populate([
                    { path: 'role', select: 'roleName' },
                    { path: 'class', select: 'className' },
                    { path: 'createdBy', select: '_id firstName role' },
                    { path: 'updatedBy', select: '_id firstName role' },
                ])
                .populate([
                    { path: 'createdBy.role', model: 'Role', select: 'roleName' },
                    { path: 'updatedBy.role', model: 'Role', select: 'roleName' }
                ]);
            if (!getAllStudent) return new Error("getting error in finding all student")
            console.log(getAllStudent);
            return getAllStudent
        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

// done
const getProfile = combineResolvers(isAuthenticatedStudent,
    async (_, args, user) => {
        try {
            const getProfile = await User.findOne({ _id: user._id, isDeleted: false })
                .populate([
                    { path: 'role', select: 'roleName' },
                    { path: 'class', select: 'className' },
                    { path: 'createdBy', select: '_id firstName role' },
                    { path: 'updatedBy', select: '_id firstName role' },
                ])
                .populate([
                    { path: 'createdBy.role', model: 'Role', select: 'roleName' },
                    { path: 'updatedBy.role', model: 'Role', select: 'roleName' }
                ]);
            if (!getProfile) return new Error("getting error in finding profile")
            console.log(getProfile);
            return getProfile
        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    }
)

const studentResolvers = {
    Query: {
        getStudent,
        getAllStudent,
        getProfile
    },
    Mutation: {
        createStudent,
        updateStudent,
        deleteStudent
    }
}

module.exports = { studentResolvers }