// const { sequelize } = require('./models');
// // (cd to src first then create db )sequelize db:create in cli
// sequelize.sync({ alter: true });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const error = require('./middlewares/error');
const notFound = require('./middlewares/notFound');
const authenticate = require('./middlewares/authenticate');
const authenAdmin = require('./middlewares/authenAdmin');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRoute);
app.use('/user', authenticate, userRoute);
app.use('/admin', authenticate, authenAdmin, adminRoute);

app.use(notFound);
app.use(error);

// auth/user/login
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server runing on port: ${port}`);
});
