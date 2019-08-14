var fs = require('fs')
var HtmlReporter = require('./htmlGenerator').generateHtmlReport

async function GenerateReport(metric, auditResult, videoPath) {
    var metric = JSON.parse(metric)
    var auditResult = JSON.parse(auditResult)
    var cutterStart = (metric.performance.navigationStart - metric.startTime) / 1000
    var loadEventEnd = metric.performance.loadEventEnd - metric.performance.navigationStart
    var testName = metric.pageName;

    var resultTimestampFrames = []
    var durationOfVideo = metric.performance.loadEventEnd - metric.performance.navigationStart
    var cutterIterator = Math.floor(durationOfVideo / 7)

    for (let index = cutterIterator; resultTimestampFrames.length < 6; index = index + cutterIterator) {
        resultTimestampFrames.push(index)
    }
    resultTimestampFrames.push(loadEventEnd)
    resultTimestampFrames = resultTimestampFrames.map((time) => time / 1000).map((time) => (time + cutterStart).toFixed(2))

    var ffmpegProcess = require('child_process').spawn
    if(!fs.existsSync('/tmp/frames/'+testName)){
        await fs.mkdirSync('/tmp/frames/'+testName)
    }
    for (const time in resultTimestampFrames) {
        ffmpeg = ffmpegProcess('ffmpeg', ['-ss', resultTimestampFrames[time], '-i', videoPath, '-vframes','1', '/tmp/frames/' + testName + '/'+time+'_out.jpg'])
        ffmpeg.on('end', function() {
            console.log('file has been converted successfully');
        })
    }
    var compliteTrigger = 0
    while (compliteTrigger < 7){
        compliteTrigger = await fs.readdirSync('/tmp/frames/' + testName + '/').length
    }
    await prepareDataToReport(metric, auditResult)
                .then((dataForReport) => HtmlReporter(dataForReport))
                .then(()=>{console.log('report: '+testName +' was generated')})
                .catch((err)=>{console.log(err)})
}

async function getBase64Images(pageName) {
    imageBase64Array = []
    var framesPath = await fs.readdirSync('/tmp/frames/' + pageName + '/')
    for (let path of framesPath) {
        var imageInBase64 = await fs.readFileSync('/tmp/frames/' + pageName + '/' + path, 'base64')
        imageBase64Array.push(imageInBase64)
        await fs.unlinkSync('/tmp/frames/' + pageName + '/' + path)
    }
    return imageBase64Array
}

async function prepareDataToReport(data, score) {
    var dataforHtml = score
    var pageTimings = data.performance;
    var resorceTimings = data.resource
    var imageBase64Array = await getBase64Images(data.pageName)
    
    dataforHtml.pageName = data.pageName
    dataforHtml.ReportTiming = JSON.stringify(pageTimings)
    dataforHtml.ReportResource = JSON.stringify(resorceTimings)
    dataforHtml.frameBase64Array = imageBase64Array
    dataforHtml.TestStatus = data.status
    return dataforHtml
}

module.exports = { GenerateReport }