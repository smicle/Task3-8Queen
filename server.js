const express = require('express')
const app = express()

app.set('port', process.env.PORT || 5000)
app.use(express.static(`${__dirname}/public`))

app.listen(app.get('port'), _ => console.log('Node app is running at localhost:' + app.get('port')))
