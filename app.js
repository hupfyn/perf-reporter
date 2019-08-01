var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8585;

var HtmlReporter = require('./perf-reporter/report').generateHtmlReport


app.use(bodyParser.json({limit: '50mb', extended: true}))

app.post('/generate', async function(request, responce){
    console.log('Data received to processing')
    await HtmlReporter(request.body)
    console.log('Html report was generated')
    responce.send("Report was generated")
})

app.post('/influx', async function(request, responce){
    console.log('Data received to processing')
})



app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })