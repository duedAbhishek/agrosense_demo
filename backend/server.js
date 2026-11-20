const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/agrosense')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api', apiRoutes);

app.listen(5000, () => console.log('Node API running on port 5000'));