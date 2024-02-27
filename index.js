require('dotenv').config();
const jwt = require('jsonwebtoken')
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const connectMongoDB = require('./db.js');

const typeDefs = require('./graphQL/typeDef');
const resolvers = require('./graphQL/resolvers');

const app = express();
app.use(express.json());

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    context: ({ req }) => {
        const token = req.headers.authorization || "";
        // console.log("token : " + token);
        if (!token) return new Error('Not authenticated')
        try {
            const decoder = jwt.verify(token, process.env.JWT_SECRET,
                (err, decodedToken) => {
                    if (err) {
                        return new Error(
                            "Invalid or expired token.",
                            "UNAUTHENTICATED"
                        )
                        // throw new ApolloError(
                        //     "Invalid or expired token.",
                        //     "UNAUTHENTICATED"
                        // );
                    }
                    return { token: decodedToken || null };
                });

            const user = decoder.token || null
            return user;
        } catch (error) {
            console.log("error msg : " + error.message);
            // throw new ApolloError("Invalid or expired token.", "UNAUTHENTICATED");            
            return new Error("Invalid or expired token.", "UNAUTHENTICATED");
        }
    }
});


async function startServer() {
    await server.start();
    server.applyMiddleware({ app });
}

startServer().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}/graphql`);
    });
});

connectMongoDB();