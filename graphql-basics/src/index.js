import { GraphQLServer } from "graphql-yoga"

// Demo user data
const users = [{
    id: 1,
    name: "Nicky",
    email: "nicky@gmail.com",
    age: 28
},
{
    id: 2,
    name: "Jane",
    email: "jane@gmail.com"
}
]

// Type Definitions (also known as app schema, which is what our data types look like)
const typeDefs = `
    type Query {
        grades: [Int!]!
        add(numbers: [Int!]): Int!
        users: [User!]!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
`


// Resolvers
// Now we define our resolvers. We only have a singele operation, we are only going to define a single function.
const resolvers = {
    Query: {
        grades(parent, args) {
            return [1, 3, 4]
        },
        add(parent, args) {
            if (args.numbers) {
                return args.numbers.reduce((tot, acc) => {
                    return tot + acc;
                },0)
            }
            return 0
        },
        users(parent, args) {
            return users
        }
    }
}

const server = new GraphQLServer({
    typeDefs, resolvers
})

server.start(() => {
    console.log('The server is up')
})