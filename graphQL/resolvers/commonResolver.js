const { User, Result, Topper } = require('../../models');
const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticatedAdmin } = require('../../utils');

// done
const login = async (_, { input }) => {
    const { email, password } = input
    try {
        const userData = await User.findOne({ email, isDeleted: false }).populate('role', 'roleName')
        if (!userData) return new Error("wrong email and password")
        const isMatch = await userData.isPasswordCorrect(password)
        if (!isMatch) return new Error("wrong email and password")
        const accessToken = await userData.generateAccessToken();
        userData.accessToken = accessToken
        return userData
    } catch (error) {
        console.log(error);
        return {
            message: "User login field",
            error: error.message
        }
    }
}

// done
const getToppersBasedOnClass = combineResolvers(isAuthenticatedAdmin,
    async () => {
        try {

            await Result.aggregate([
                {
                    $match: {
                        isDeleted: false,
                    }
                },
                {
                    $addFields: {
                        result: {
                            $cond: {
                                if: {
                                    $anyElementTrue: {
                                        $map: {
                                            input: '$scores',
                                            as: 'score',
                                            in: { $lt: ['$$score.marksObtained', 23] }
                                        }
                                    }
                                },
                                then: 'fail',
                                else: 'pass'
                            }
                        },
                        percentage: {
                            $multiply: [
                                {
                                    $divide: [
                                        {
                                            $sum: '$scores.marksObtained'
                                        },
                                        {
                                            $sum: '$scores.total'
                                        }
                                    ]
                                },
                                100
                            ]
                        },
                        grade: {
                            $cond: {
                                if: { $eq: ['$result', 'fail'] },
                                then: 'fail',
                                else: {
                                    $switch: {
                                        branches: [
                                            { case: { $gte: ['$percentage', 70] }, then: 'distinction' },
                                            { case: { $and: [{ $gte: ['$percentage', 60] }, { $lt: ['$percentage', 70] }] }, then: 'first class' },
                                            { case: { $and: [{ $gte: ['$percentage', 50] }, { $lt: ['$percentage', 60] }] }, then: 'second class' },
                                        ],
                                        default: 'pass'
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $sort: {
                        percentage: -1
                    }
                },
                {
                    $group: {
                        _id: "$class",
                        noOfFailStudents: { $sum: { $cond: { if: { $eq: ['$result', 'fail'] }, then: 1, else: 0 } } },
                        noOfPassStudents: { $sum: { $cond: { if: { $eq: ['$result', 'pass'] }, then: 1, else: 0 } } },
                        studentData: {
                            $push: {
                                student: "$student",
                                percentage: "$percentage",
                                grade: "$grade"
                            }
                        }
                    }
                },
                {
                    $project: {
                        class: "$_id",
                        noOfFailStudents: 1,
                        noOfPassStudents: 1,
                        highestScores: {
                            $slice: ["$studentData", 3],
                        },
                    }
                },                
                {
                    $sort: {
                        class: 1
                    }
                },
                {
                    $out: "toppers"
                }
            ])

            const getToppers = await Topper.find({})
                .populate([
                    { path: 'class', select: 'className' },
                    { path: 'highestScores.student', select: 'firstName lastName' }
                ])
                .sort({ class: 1 })
            console.log(getToppers);
            return getToppers;

        } catch (error) {
            console.log(error.message);
            return new Error(error.message);
        }
    })

const commonResolvers = {
    Query: {
        getToppersBasedOnClass
    },
    Mutation: {
        login
    }
}

module.exports = { commonResolvers }