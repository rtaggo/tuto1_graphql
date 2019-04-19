const express = require('express');
const bodyParser = require('body-parser');
const grahpqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];


app.use(bodyParser.json());

/*
app.get('/', (req, res, next)=> {
  res.send('Hello World');
});
*/

/* 
* /graphql can be rename to any (ex: /api)

  schema: // point to a valid GraphGQL Schema
  rootValue:  // point a JS Object with all the resolvers functions in it. Functions need to match schema by name

  ID! => the "!" means ID can not be null
*/
app.use('/graphql', 
  grahpqlHttp({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput:EventInput) : Event
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `), 
    rootValue: { 
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const eventName = args.name;
        const event = {
          _id: Math.random().toString(),
          title: args.title,
          description: args.description,
          price: +args.price,
          date: new Date().toISOString()
        }
        events.push(event);
        return event;
      }
    },
    graphiql: true
  })
);

app.listen(3000);