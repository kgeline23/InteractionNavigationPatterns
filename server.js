const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
app.listen(port, () => {
     console.log(`Server is up on port ${port}`);
});
app.use('/', express.static(path.join(__dirname, "public")));