var fs = require('fs')
var pug = require('pug')

async function generateHtmlReport(receivedData){
    var resultHtmlFile = pug.renderFile('./report_generator_module/template/index.pug',receivedData)
    await fs.writeFileSync('/tmp/reports/'+ receivedData.pageName+'.html',resultHtmlFile)
}

module.exports = {generateHtmlReport}