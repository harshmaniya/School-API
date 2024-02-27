const { gql } = require('apollo-server');

const classType = gql`

type class{
    _id: ID
    className: String
}

type Query{
    getClass(_id: ID!): class
    getAllClass: [class]
}

type Mutation{
    createClass(className: String!): class
    updateClass(_id: ID!, className: String!): class
    deleteClass(_id: ID!): class
}
`
module.exports = classType