const commonType = require("./commonType")
const classType = require("./classType")
const subjectType = require("./subjectType")
const facultyType = require("./facultyType")
const studentType = require("./studentType")
const resultType = require("./resultType")

const typeDefs = [
    commonType,
    classType,
    subjectType,
    facultyType,
    studentType,
    resultType
]

module.exports = typeDefs