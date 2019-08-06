var express = require('express');
var bodyParser = require('body-parser');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var app = express();
var port = process.env.PORT || 8585;

var HtmlReporter = require('./report_generator_module/report').generateHtmlReport


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
var cpUpolad = upload.fields([{ name: 'video', maxCount: 1 }, { name: 'data', maxCount: 1 }])
app.post('/metric', cpUpolad ,async function(request, responce){
    console.log('Data received to processing')
    responce.send('Data received to processing')
    console.log(request.files.video)
    // console.log(request.body)
})


app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })