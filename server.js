//allow express
const express = require('express');
//PORT designation and app expression
const PORT = process.env.PORT || 3001;
const app = express();
//middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());







app.get('/', (req, res) => {
    res.json({
        message: 'Oh hello, world.'
    })
})
app.use((req, res) => {
    res.status(404).end();
})
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})