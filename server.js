const express = require('express');
//import express framework from node modules

const app = express();
//create a new instance of express and assign it to the variable app

const bodyParser = require('body-parser');
//allow app to parse json

const environment = process.env.NODE_ENV || 'development';
//create environment variable and assign it to node environment or default development

const configuration = require('./knexfile')[environment];
//create configuration variable and assign it to knex npm module using our environment variable

const database = require('knex')(configuration);
//create a new instance of database using knex to configure 

app.use(bodyParser.json());
//invoking the use method on app so that it uses bodyParser to parse json

app.use(bodyParser.urlencoded({ extended: true }));
//invoking the use method on app so that it can parse HTML forms

app.use(express.static('public/'));
//invoking the use method on app so that it serves static resources from the public file

app.set('port', process.env.PORT || 3000);
//invoking the set method on app in order to assign the port based on the node env variable of port or default 3000 

app.locals.title = 'Palette Picker';
//assigning a non persisting app name using locals

app.get('/', (request, response) => {
//assigning the endpoint for the root directory 
  response.send('Oh hey Palette Picker');
  //if there is no html this will display in the browser for root directory
});


app.get('/api/v1/projects', (request, response) => {
  //assigning endpoint for project table in database
  database('projects').select()
  //selecting all projects in the table which returns promise
    .then((projects) => {
      response.status(200).json(projects);
  //return json response object and status code of 200 which means successful
    })
    .catch((error) => {
      response.status(500).json({ error });
  //returns a response error object and status code of 500 if there is an error 
    });
});
app.get('/api/v1/palettes', (request, response) => {
  //assigning endpoint for the palettes table in database
  database('palettes').select()
  //selecting all palettes in the table which returns a promise
    .then((palettes) => {
      response.status(200).json(palettes);
    //return json response object and status code of 200 which means successful
    })
    .catch((error) => {
      response.status(500).json({ error });
    //returns a response error object and status code of 500 if there is an error
    });
});

app.post('/api/v1/projects', (request, response) => {
  //assigning endpoint to add new record to projects table
  const project = request.body;
//declaring a project variable and assigning the value of the body property on the request object
  for (let requiredParameter of ['name']) {
    //defining required parameters
    if (!project[requiredParameter]) {
      //if there are missing required parameters return this response
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a '${requiredParameter}' property.` });
      //return a response object with status code 422 and error object indicating the required parameters that are missing
    }
  }

  database('projects').insert(project, 'id')
  //if all required parameters then insert a new record in the projects table and assign primary key of id
    .then(project => {
      response.status(201).json({ id: project[0] })
  //return response object with a status code of 201 which means record has been inserted successfully and project id
    })
    .catch(error => {
      response.status(500).json({ error });
  //if the server encounters an error send status code of 500 and response error object
    });
});

app.post('/api/v1/palettes', (request, response) => {
  //assigning endpoint to add new record to palettes table
  const palette = request.body;
//declaring a palette variable and assigning the value of the body property on the request object

  for (let requiredParameter of ['name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5', 'project_id']) {
  //defining required parameters
    if (!palette[requiredParameter]) {
  //if there are missing required parameters return this response
      return response 
        .status(422)
        .send({ error: `Expected format: { name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String>, project_id: <Number> }. You're missing a '${requiredParameter}' property.` });
  //return a response object with status code 422 and error object indicating the required parameters that are missing
    }
  }

  database('palettes').insert(palette, 'id')
  //if all required parameters then insert a new record in the palettes table and assign primary key of id
    .then(palette => {
      response.status(201).json({ id: palette[0] })
  //return response object with a status code of 201 which means record has been inserted successfully and project id
    })
    .catch(error => {
      response.status(500).json({ error });
  //if the server encounters an error send status code of 500 and response error object
    });
});

app.get('/api/v1/projects/:id', (request, response) => {
//assigning endpoint to get specific project by dynamic primary key

  database('projects').where('id', request.params.id).select()
  //selecting matching record in projects table with correct primary id key
    .then(project => {
      if (projects.length) {
    //if the response exists then 
        response.status(200).json(project);
    //return response object with a status code of 200 successful and project object
      } else {
        response.status(404).json({
          error: `Could not find project with id ${request.params.id}`
    //if record is not found return response object with error message and status code of 404
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error })
  //if the server encounters an error send status code of 500 and response error object
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
//assigning endpoint to delete specific palette record by dynamic primary key
  database('palettes').where('id', request.params.id).del()
  //deleting specific record in palettes table where id from url matches primary key
    .then(foundPalette => {
      if (!foundPalette) {
        return response.status(422).json({ error: 'This palette does not exist.' });
    //if the id in url doesn't match primary key in palettes table return error response object with status code of 422
      } else {
        return response.sendStatus(204)
    //send status code 204 which tells user record has been successfully deleted
      }
    })
    .catch(error => {
      response.status(500).json({ error })
  //if the server encounters an error send status code of 500 and response error object
    });
});

app.listen(app.get('port'), () => {
//invoking the listen method on app
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
//when server is running console log in terminal name of app and the port it is running on
});