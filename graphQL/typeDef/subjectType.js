const { gql } = require('apollo-server');

const subjectType = gql`

type subject{
    _id: ID
    subjectName: String
    subjectCode: String    
}

type Mutation{
    createSubject(subjectName: String!, subjectCode: String!): subject
    updateSubject(_id: ID!, subjectName: String, subjectCode: String): subject
    deleteSubject(_id: ID!): subject
}

type Query{
    getSubject(_id: ID!): subject
    getAllSubject: [subject]
}
`
module.exports = subjectType