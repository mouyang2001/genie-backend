const express = require('express');
const PORT = 9000;

const app = express();

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});

app.use('/', require('./routes/mainRouter.js'));

