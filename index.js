const express = require('express');
const app = express();

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/mainRouter.js'));
