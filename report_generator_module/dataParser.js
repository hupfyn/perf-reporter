var fs = require('fs');
var atob = require('atob')

async function parseData(recivedData){
    var decodeVideo = atob(recivedData.videoString);
    await fs.writeFileSync('test.mp4',decodeVideo);
}

module.exports = {parseData}