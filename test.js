var ffmpeg = require('fluent-ffmpeg')
const cmd = ffmpeg('/tmp/video/AmazonSearchWithParameters_2_video.mp4')

var options = {
    folder: '/tmp/frames/',
    timestamps: [1, 3, 4, 6, 7, 9, 10 ]
}

function test(iterarot) {
    for (let index = 0; index < iterarot; index++) {
        options.filename = index+'%d.jpg',
        cmd.screenshots(options)
        
    }
}


test(10)