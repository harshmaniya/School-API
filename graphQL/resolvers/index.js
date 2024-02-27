const { merge } = require("lodash");

const { commonResolvers } = require('./commonResolver')
const { classResolvers } = require('./classResolver')
const { subjectResolvers } = require('./subjectResolver')
const { facultyResolvers } = require('./facultyResolver');
const { studentResolvers } = require("./studentResolver");
const { resultResolvers } = require("./resultResolver");


const resolvers = merge(
    commonResolvers,
    classResolvers,
    subjectResolvers,
    facultyResolvers,
    studentResolvers,
    resultResolvers
)

module.exports = resolvers