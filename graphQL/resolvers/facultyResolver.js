const { User } = require('../../models');
const { getRoleId, isAuthenticatedAdmin } = require('../../utils');
const { combineResolvers } = require('graphql-resolvers')

// done
const createFaculty = combineResolvers(isAuthenticatedAdmin,
    async (_, args, user) => {
        try {
            const { input } = args
            const isExist = await User.findOne({ email: input.email, isDeleted: false })
            console.log(isExist);
            if (isExist) return new Error("email already exist")

            input.role = await getRoleId('faculty')

            const isAssignedClass = await User.find({ class: input.class, role: input.role, isDeleted: false })
            if (isAssignedClass.length > 0) return new Error("given class is already assigned to another faculty! please select different one");

            const isAssignedSubject = await User.find({ subject: input.subject, isDeleted: false })
            if (isAssignedSubject.length > 0) return new Error("given subject is already assigned to another faculty! please select different one");

            input.createdBy = user._id
            console.log(input);
            input.role = await getRoleId('faculty')

            const newFaculty = await User.create(input)
            if (!newFaculty) return new Error("faculty not created")
            console.log(newFaculty);
            return newFaculty

        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

// done
const updateFaculty = combineResolvers(isAuthenticatedAdmin,
    async (_, { _id, input }, user) => {
        try {

            input.role = await getRoleId('faculty')

            if (input.class) {
                const isAssignedClass = await User.find({ class: input.class, role: input.role, isDeleted: false })
                if (isAssignedClass.length > 0) return new Error("given class is already assigned to another faculty! please select different one");
            }

            if (input.subject) {
                const isAssignedSubject = await User.find({ subject: input.subject, isDeleted: false })
                if (isAssignedSubject.length > 0) return new Error("given subject is already assigned to another faculty! please select different one");
            }

            input.updatedBy = user._id

            const updateFaculty = await User.findOne({ _id, isDeleted: false })
            if (!updateFaculty) return new Error("faculty not found")


            Object.assign(updateFaculty, input);
            await updateFaculty.save();
            if (!updateFaculty) return new Error("getting error in faculty update!")

            console.log(updateFaculty);
            return updateFaculty
        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

// done
const deleteFaculty = combineResolvers(isAuthenticatedAdmin,
    async (_, args) => {
        try {
            const { _id } = args
            const deleteFaculty = await User.findOneAndUpdate({ _id, isDeleted: false }, { isDeleted: true }, { new: true })
            if (!deleteFaculty) return new Error("getting error in faculty delete")
            return deleteFaculty
        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

// done
const getFaculty = combineResolvers(isAuthenticatedAdmin,
    async (_, args) => {
        try {
            const { _id } = args
            const getFaculty = await User.findOne({ _id, isDeleted: false })
                .populate([
                    { path: 'role', select: 'roleName' },
                    { path: 'class', select: 'className' },
                    { path: 'subject', select: 'subjectName subjectCode' },
                    { path: 'createdBy', select: '_id firstName role' },
                    { path: 'updatedBy', select: '_id firstName role' },
                ])
                .populate([
                    { path: 'createdBy', populate: { path: 'role', select: 'roleName' } },
                    { path: 'updatedBy', populate: { path: 'role', select: 'roleName' } }
                ])
            if (!getFaculty) return new Error("getting error in finding faculty")
            console.log(getFaculty);
            return getFaculty
        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

// done
const getAllFaculty = combineResolvers(isAuthenticatedAdmin,
    async () => {
        try {
            const getAllFaculty = await User.find({ isDeleted: false })
                .populate([
                    { path: 'role', select: 'roleName' },
                    { path: 'class', select: 'className' },
                    { path: 'subject', select: 'subjectName subjectCode' },
                    { path: 'createdBy', select: '_id firstName role' },
                    { path: 'updatedBy', select: '_id firstName role' },
                ])
                .populate([
                    { path: 'createdBy', populate: { path: 'role', select: 'roleName' } },
                    { path: 'updatedBy', populate: { path: 'role', select: 'roleName' } }
                ])
            if (!getAllFaculty) return new Error("getting error in finding all faculty")
            console.log(getAllFaculty);
            return getAllFaculty
        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

const facultyResolvers = {
    Query: {
        getFaculty,
        getAllFaculty
    },
    Mutation: {
        createFaculty,
        updateFaculty,
        deleteFaculty
    }
}

module.exports = { facultyResolvers }