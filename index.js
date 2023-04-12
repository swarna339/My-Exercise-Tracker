
const express = require('express');
const app = express();
 const cors = require('cors');
const bodyParser = require('body-parser');
const shortid = require('shortid');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const users = [];
//let nextUserId = 1;
app.get('/', (req, res) => {
      res.sendFile(__dirname + '/views/index.html')
});
   
      function getUserById(userId) {
        return users.find(user => user._id == userId);
      }
          // Create a new user
          app.post('/api/users', (req, res) => {
            const { username } = req.body;
            const user = {  username,_id: shortid.generate() };
            users.push(user);
            res.json(user);
          });
          // Get a list of all users
app.get('/api/users', (req, res) => {
  try {
    const userArray = users.map(user => ({ username: user.username, _id: user._id }));
    res.status(200).json(userArray); // return array of users as JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});




app.post('/api/users/:_id/exercises', (req, res) => {
  const { description, duration, date } = req.body;
  const { _id } = req.params;
  // Find the user with the specified _id
 const user = getUserById(_id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

 const exercise = {
     username: user.username,
    description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
    _id: user._id
  };
  user.log ? user.log.push(exercise) : (user.log = [exercise]);
  user.count = user.log.length;
  res.json(exercise);
});

app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const user = getUserById(_id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  let log = user.log || [];

  if (from) {
    log = log.filter(exercise => new Date(exercise.date) >= new Date(from));
  }

  if (to) {
    log = log.filter(exercise => new Date(exercise.date) <= new Date(to));
  }

  if (limit) {
    log = log.slice(0, limit);
  }

  const response = { ...user, 
    log,
     count: log.length };
  res.json(response);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});
