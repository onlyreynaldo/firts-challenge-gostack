const express = require('express');

const server = express();
server.use(express.json());

const projects = [];

function checkIndexOfID(req, res, next) {
   const { id } = req.params;
   const Index = projects.map((e) => { return e.id; }).indexOf(id);
   if (Index == -1) {
      return res.json({ error: "Id does not exists" })
   }
   req.indice = Index;
   return next();
}

// Sending data of projects
server.post('/projects', (req, res) => {
   const { id, title } = req.body;
   projects.push({ "id": id, "title": title, "tasks": [] });
   return res.json(projects);
});

// list all projects
server.get('/projects', (req, res) => {
   return res.json(projects);
});

// update the project title,
server.put('/projects/:id', checkIndexOfID, (req, res) => {
   const { title } = req.body;
   projects[req.indice].title = title;
   return res.json(projects[req.indice]);
});

/**
 * Removing a project using local middleware
 */
server.delete('/projects/:id', checkIndexOfID, (req, res) => {
   projects.splice(req.indice, 1);
   return res.send();
});

/**
 * Adding a path to save the tasks within a specific project, 
 * along with it we add a middleware filter, 
 * which validates the ID 
 */
server.post('/projects/:id/tasks', checkIndexOfID, (req, res) => {
   const { title } = req.body;
   projects[req.indice].tasks.push(title);
   return res.json(projects[req.indice]);
});

server.listen(3333);