const { default: mongoose } = require('mongoose');
const { Result, User, Subject, Class } = require('../../models')
const { isAuthenticatedFaculty } = require('../../utils')
const { combineResolvers } = require('graphql-resolvers')

// done
const createResult = combineResolvers(isAuthenticatedFaculty,
    async (_, { input }, user) => {
        try {

            const isResultExist = await Result.findOne({ student: input.student, class: input.class, isDeleted: false })
            if (isResultExist) {
                throw new Error("Given student's result is already exist!");
            }

            const studentIsExist = await User.findOne({ _id: input.student, isDeleted: false });
            const classIsExist = await Class.findOne({ _id: input.class, isDeleted: false });

            if (!studentIsExist) {
                throw new Error("Given student is not found!");
            }
            if (!classIsExist) {
                throw new Error("Given class is not found!");
            }

            let totalSubjectMarks = 0;
            let totalObtainMarks = 0;

            const processScores = async (data) => {
                for (const score of data) {
                    try {
                        const subjectIsExist = await Subject.findOne({ _id: score.subject, isDeleted: false });
                        if (!subjectIsExist) {
                            throw new Error(`Subject with ID ${score.subject} not found`);
                        }
                        totalSubjectMarks += score.total;
                        totalObtainMarks += score.marksObtained;
                    } catch (error) {
                        console.error(`Error finding subject: ${error.message}`);
                        throw error;
                    }
                }
            };

            await processScores(input.scores);

            input.totalSubjectMarks = totalSubjectMarks;
            input.totalObtainMarks = totalObtainMarks;

            input.faculty = user._id;

            const newResult = await Result.create(input);
            console.log("newResult--------------:", newResult.scores);

            if (!newResult) {
                throw new Error("Result not created");
            }

            return {
                message: "Result created successfully!"
            };

        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }
);

// done --- forEach
const updateResult = combineResolvers(isAuthenticatedFaculty,
    async (_, { _id, input }) => {
        try {
            const isResultExist = await Result.findOne({ _id, isDeleted: false });
            if (!isResultExist) {
                throw new Error("Given student's result is not exist!");
            }

            if (input.student) {
                const studentIsExist = await User.findOne({ _id: input.student, isDeleted: false });
                if (!studentIsExist) {
                    throw new Error("Given student is not found!");
                }
            }

            if (input.class) {
                const classIsExist = await Class.findOne({ _id: input.class, isDeleted: false });
                if (!classIsExist) {
                    throw new Error("Given class is not found!");
                }
            }

            const processScores = async (data) => {
                for (const score of data) {
                    try {
                        const subjectIsExist = await Subject.findOne({ _id: score.subject, isDeleted: false });
                        if (!subjectIsExist) {
                            throw new Error(`Subject with ID ${score.subject} not found`);
                        }
                    } catch (error) {
                        console.error(`Error finding subject: ${error.message}`);
                        throw error;
                    }
                }
            };

            await processScores(input.scores);

            const updateResult = await Result.findOne({ _id, isDeleted: false });
            if (!updateResult) return new Error("Getting error in result update!");

            input.scores.forEach((secondItem) => {
                const matchingItemIndex = updateResult.scores.findIndex((firstItem) => firstItem.subject.toString() === secondItem.subject.toString());                
                if (matchingItemIndex !== -1) {                   
                    updateResult.scores[matchingItemIndex].marksObtained = secondItem.marksObtained;
                    updateResult.scores[matchingItemIndex].total = secondItem.total;
                } else {                 
                    updateResult.scores.push({
                        marksObtained: secondItem.marksObtained,
                        subject: secondItem.subject,
                        total: secondItem.total
                    });
                }
            });


            await updateResult.save();
            console.log("🚀 ~ updateResult.scores:", updateResult.scores);
            return { message: "Result updated successfully!" };
        } catch (error) {
            console.log(error.message);
            return new Error(error.message);
        }
    });

// done
const deleteResult = combineResolvers(isAuthenticatedFaculty,
    async (_, args) => {
        try {
            const { _id } = args
            const deleteResult = await Result.findOneAndUpdate({ _id, isDeleted: false }, { isDeleted: true })
            if (!deleteResult) return new Error("getting error in result delete")
            return { message: "Result deleted successfully!" }
        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

// done
const getResult = combineResolvers(isAuthenticatedFaculty,
    async (_, args) => {
        try {
            console.log(args);
            const { _id } = args
            const getResult = await Result.findOne({ _id, isDeleted: false })
                .populate([
                    { path: 'student', select: 'firstName' },
                    { path: 'class', select: 'className' },
                    { path: 'faculty', select: 'firstName' },
                ])
                .populate({ path: 'scores.subject', model: 'subject', select: 'subjectName' })
            console.log(getResult);
            if (!getResult) return new Error("getting error in finding result")
            console.log(getResult);
            return getResult
        } catch (error) {
            console.log(error.message);
            return new Error(error.message)
        }
    })

const resultResolvers = {
    Query: {
        getResult
    },
    Mutation: {
        createResult,
        updateResult,
        deleteResult
    }
}

module.exports = { resultResolvers }