const { gql } = require('apollo-server');

const facultyType = gql`

type faculty{
    _id: ID
    firstName: String
    lastName: String
    email: String
    gender: genderOptions
    role: roleRef
    class: class
    subject: subject
    password: String
    createdBy: createdByRef
    updatedBy: updatedByRef
}

input facultyInput{
    firstName: String
    lastName: String
    email: String
    gender: genderOptions
    class: ID
    subject: ID
    password: String
}

type Mutation{
    createFaculty(input: facultyInput): faculty
    updateFaculty(_id: ID!, input: facultyInput): faculty
    deleteFaculty(_id: ID!): faculty
}

type Query{
    getFaculty(_id: ID!): faculty
    getAllFaculty: [faculty]
}
`
module.exports = facultyType