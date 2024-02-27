const { gql } = require('apollo-server');

const resultType = gql`

    type score {
        subject: subject!
        total: Int!
        marksObtained: Int!
    }

    type result {
        _id: ID
        faculty: faculty
        student: student
        class: class
        scores: [score]
        totalSubjectMarks: Int
        totalObtainMarks: Int
        result: String
        grade: String
        percentage: Float
    }

    type response{
        message: String
    }

    input scoreInput {
        subject: ID!
        total: Int!
        marksObtained: Int!
    }
    
    input resultInput {        
        student: ID
        class: ID
        scores: [scoreInput]      
    }

    type Mutation {
        createResult(input: resultInput): response
        updateResult(_id: ID!, input: resultInput): response
        deleteResult(_id: ID!): response
    }

    type Query {
        getResult(_id: ID!): result       
    }
`;

module.exports = resultType;
