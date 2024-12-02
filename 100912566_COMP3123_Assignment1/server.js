const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3030;
const DB_URL = "mongodb+srv://100912566:LiWfJGmZTiktZa4f@cluster0.vcoq3.mongodb.net/comp3123?retryWrites=true&w=majority&appName=Cluster0"

app.use(cors(
  {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }
));

app.use(express.json());

mongoose.connect(DB_URL).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});