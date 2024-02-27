const { gql } = require('apollo-server');

const studentType = gql`
    type student{
        _id: ID
        firstName: String
        lastName: String
        email: String
        gender: genderOptions
        role: roleRef
        class: class
        enrNo: String      
        password: String    
        createdBy: createdByRef
        updatedBy: updatedByRef
    }

    input studentInput{
        firstName: String
        lastName: String
        email: String
        gender: genderOptions
        class: ID
        password: String
    }

    type Mutation{
        createStudent(input: studentInput): student
        updateStudent(_id: ID!, input: studentInput): student
        deleteStudent(_id: ID!): student
    }

    type Query{
        getStudent(_id: ID!): student
        getAllStudent: [student]
        getProfile: student
    }
`
module.exports = studentType