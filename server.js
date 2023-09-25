const mongoose = require('mongoose');

const app = require('./app')

mongoose
  .connect(process.env.MONGO_URL)
  .then((con) => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

const port = process.env.PORT||7000;

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});