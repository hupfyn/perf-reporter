var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: '/tmp/uploads/' });
var app = express();
var port = process.env.PORT || 8585;


var Report = require('./report_generator_module/Reporter').GenerateReport

app.use(bodyParser.json({ limit: '50mb', extended: true }))

var cpUpload = upload.fields([{ name: 'video', maxCount: 1 }, { name: 'performanceData', maxCount: 1 }, { name: 'auditData', maxCount: 1 }])
app.post('/metric', cpUpload, async function (request, response) {
    console.warn('Data received to processing')
    response.send('Data received to processing')

    var metric = request.body.performanceData
    var auditData = request.body.auditData
    var videoPath = request.files.video[0].path

    Report(metric,auditData,videoPath)
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})