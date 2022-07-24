//importing necessary libraries

var express = require('express');              
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var fs = require("fs");
var { DataStore } = require('notarealdb');
const { report } = require('process');

//initialize the database
const db = new DataStore('database');
const studentDB = db.collection('studentData');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(fs.readFileSync("schema.graphql").toString());  //returns a buffer but buildschema needs string so we convert to string


// The root provides a resolver function for each API endpoint
var root = {
//   hello: () => {
//     return 'Hello world!';
//   },
listStudents: () => {
    return studentDB.list()

},
getStudent: (argument) => {
    return studentDB.get(argument.id)
},
createStudent: (argument) => {
    const studentStuff = {
        id: argument.id,
        name: argument.name,
        age: argument.age 
    }
    return studentDB.create(studentStuff);
    
},
deleteStudent: (argument) => {

    const studentObj = studentDB.get(argument.id);
    studentDB.delete(argument.id);
    
    return studentObj;
    
},
updateStudent: (argument) => {

    const studentStuff = {
        id: argument.id,
        name: argument.name,
        age: argument.age 
    }
    studentDB.update(studentStuff);
    const studentObj = studentDB.get(argument.id);
    
    return studentObj;
    
}

};



var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');