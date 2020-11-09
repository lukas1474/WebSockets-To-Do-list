const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

let tasks = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New connection! Its id - ' +socket.id);
  console.log(tasks);

  socket.emit('updateData', tasks);


  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (taskIndex) => {
    const removedTask = tasks.filter((task) => task.id === taskIndex)[0];
    tasks.splice(tasks.indexOf(removedTask), 1);
    
    socket.broadcast.emit('removeTask', taskIndex);
    console.log(tasks);
  });
});


