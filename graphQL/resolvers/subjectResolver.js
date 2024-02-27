const { combineResolvers } = require('graphql-resolvers')
const { Subject } = require('../../models')
const { isAuthenticatedAdmin } = require('../../utils')

// done
const createSubject = combineResolvers(isAuthenticatedAdmin,
    async (_, args) => {
        try {
            const { subjectName, subjectCode } = args
            console.log(subjectName);
            const newSubject = await Subject.create({ subjectName, subjectCode });
            if (!newSubject) return new Error("Subject not created")
            console.log(newSubject);
            return newSubject
        } catch (error) {
            console.log(error.message);
            throw new Error(error.message)
        }
    })

// done
const updateSubject = combineResolvers(isAuthenticatedAdmin,
    async (_, args) => {
        try {
            const { _id, ...rest } = args
            const subject = await Subject.findOneAndUpdate({ _id, isDeleted: false }, { ...rest }, { new: true })
            if (!subject) return new Error("Subject not updated")
            return subject
        } catch (error) {
            console.log(error.message);
            throw new Error(error.message)
        }
    })

// done
const deleteSubject = combineResolvers(isAuthenticatedAdmin,
    async (_, { _id }) => {
        try {
            const subject = await Subject.findOneAndUpdate({ _id, isDeleted: false }, { isDeleted: true })
            if (!subject) return new Error("Subject not deleted")
            return subject
        } catch (error) {
            console.log(error.message);
            throw new Error(error.message)
        }
    })

// done
const getSubject = combineResolvers(isAuthenticatedAdmin,
    async (_, { _id }) => {
        try {
            const subject = await Subject.findById({ _id, isDeleted: false })
            if (!subject) return new Error("Subject not found")
            return subject
        } catch (error) {
            console.log(error.message);
            throw new Error(error.message)
        }
    })

const getAllSubject = combineResolvers(isAuthenticatedAdmin,
    async () => {
        try {
            const subject = await Subject.find({ isDeleted: false })
            if (!subject) return new Error("Subject not found")
            return subject
        } catch (error) {
            console.log(error.message);
            throw new Error(error.message)
        }
    })


const subjectResolvers = {
    Query: {
        getSubject,
        getAllSubject
    },
    Mutation: {
        createSubject,
        updateSubject,
        deleteSubject
    }
}

module.exports = { subjectResolvers }