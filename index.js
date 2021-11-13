const express = require('express');
const app = express();

require('./startup/db')();
require('./startup/routes.js')(app);
require('./startup/prod')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
