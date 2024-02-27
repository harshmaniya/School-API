const { gql } = require('apollo-server');

const commonType = gql`

    enum genderOptions{
        male
        female        
    }

    enum roleOption{
        admin
        faculty
        student
    }

    type roleRef{
        _id: ID
        roleName: roleOption
    }

   type createdByRef{
       _id: ID      
       firstName: String
       role: roleRef
    }

    type updatedByRef{
        _id: ID        
        firstName: String
        role: roleRef
     }

    input login{
        email: String!
        password: String!
    }

    type loginResult{
        firstName: String
        accessToken: String
        role: roleRef
    }

    type highestScores{
        student: student
        grade: String
        percentage: Float
    }

    type getToppersBasedOnClassResult{
        class: class
        noOfPassStudents: Int
        noOfFailStudents: Int
        highestScores: [highestScores]
    }

    type Query{
        getToppersBasedOnClass: [getToppersBasedOnClassResult]
    }

    type Mutation{
        login(input: login!): loginResult
    }
`

module.exports = commonType