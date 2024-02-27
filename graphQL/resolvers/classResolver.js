const { isAuthenticatedAdmin } = require('../../utils')
const { Class } = require('../../models')
const { combineResolvers } = require('graphql-resolvers')

// done
const createClass = combineResolvers(isAuthenticatedAdmin,
    async (_, args) => {
        try {
            const { className } = args
            const newClass = await Class.create({ className })
            if (!newClass) return new Error("Class not created")
            console.log(newClass);
            return newClass

        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

// done
const updateClass = combineResolvers(isAuthenticatedAdmin,
    async (_, args, user) => {
        try {
            const { _id, className } = args

            const updateClass = await Class.findOneAndUpdate({ _id, isDeleted: false }, { className }, { new: true })
            if (!updateClass) return new Error("getting error in class update")
            console.log(updateClass);
            return updateClass

        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

// done
const deleteClass = combineResolvers(isAuthenticatedAdmin,
    async (_, args) => {
        try {
            const { _id } = args

            const deleteClass = await Class.findOneAndUpdate({ _id, isDeleted: false }, { isDeleted: true })
            if (!deleteClass) return new Error("getting error in class delete")
            console.log(deleteClass);
            return deleteClass

        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

// done
const getClass = combineResolvers(isAuthenticatedAdmin,
    async (_, args) => {
        try {
            const { _id } = args

            const getClass = await Class.findOne({ _id , isDeleted: false })
            if (!getClass) return new Error("getting error in finding class")
            console.log(getClass);
            return getClass

        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

// done
const getAllClass = combineResolvers(isAuthenticatedAdmin,
    async () => {
        try {
            const getAllClass = await Class.find({ isDeleted: false }).sort({ className: 1 })
            if (!getAllClass) return new Error("getting error in finding classes")
            console.log(getAllClass);
            return getAllClass
        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

const classResolvers = {
    Query: {
        getClass,
        getAllClass
    },

    Mutation: {
        createClass,
        updateClass,
        deleteClass
    }
}

module.exports = { classResolvers }