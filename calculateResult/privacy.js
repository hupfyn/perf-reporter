var calculateAdviceScore = require('./calculateScore').calculateAdviceScore

function ampPrivacy(score) {
    return {
        id: 'ampPrivacy',
        title: 'Avoid including AMP',
        description:
            "You share share private user information with Google that your user hasn't agreed on sharing.",
        advice:
            score === 0
                ? 'The page is using AMP, that makes you share private user information with Google.'
                : '',
        score: score,
        weight: 8,
        offending: [],
        tags: ['privacy']
    };
}

function privacyFacebookScore(score) {
    return {
        id: 'facebook',
        title: 'Avoid including Facebook',
        description:
            "You share share private user information with Facebook that your user hasn't agreed on sharing.",
        advice:
            score === 0
                ? 'The page gets content from Facebook. That means you share your users private information with Facebook.'
                : '',
        score: score,
        weight: 8,
        offending: [],
        tags: ['privacy']
    };
}

function privacyGoogleAnalyticsScore(score) {
    return {
        id: 'ga',
        title: 'Avoid using Google Analytics',
        description:
            "Google Analytics share private user information with Google that your user hasn't agreed on sharing.",
        advice:
            score === 0
                ? 'The page is using Google Analytics meaning you share your users private information with Google. You should use analytics that care about user privacy, something like https://matomo.org.'
                : '',
        score: score,
        weight: 8,
        offending: [],
        tags: ['privacy']
    };
}

function privacyHttpsScore(data) {
    console.log(data)
    var scores = data[0]
    var message = data[1]
    return {
        id: 'https',
        title: 'Serve your content securely',
        description:
            'A page should always use HTTPS (https://https.cio.gov/everything/). You also need that for HTTP/2. You can get your free SSL/TLC certificate from https://letsencrypt.org/.',
        advice: message,
        score: scores,
        weight: 10,
        offending: [],
        tags: ['privacy']
    };
}

function privacySurveillanceScore(data) {
    var score = data[0]
    var offending = data[1]
    var docDomain = data[2]
    return {
        id: 'surveillance',
        title: 'Avoid using surveillance web sites',
        description:
            'Do not use web sites that harvest private user information and sell it to other companies.',
        advice:
            score === 0
                ? docDomain +
                ' uses harvest user information and sell it to other companies without the users agreement. That is not OK.'
                : '',
        score: score,
        weight: 10,
        offending: offending,
        tags: ['privacy']
    };
}

function privacyYouTubeScore(score) {
    return {
        id: 'youtube',
        title: 'Avoid including Youtube videos',
        description:
          'If you include Youtube videos on your page, you are sharing private user information with Google.',
        advice:
          score === 0
            ? 'The page is including code from Youtube. You share user private information with Google. Instead you can host a video screenshot and let the user choose to go to Youtube or not, by clicking on the screenshot. You can look at http://labnol.org/?p=27941 and make sure you host your screenshot yourself. Or choose another video service.'
            : '',
        score: score,
        weight: 6,
        offending: [],
        tags: ['privacy']
      };
}

function calculatePrivacyScore(auditData){
    console.log(auditData.privacyHTTPS)
    var result =  {
        'adviceList': {
            'ampPrivacy':ampPrivacy(auditData.privacyAMP),
            'facebook':privacyFacebookScore(auditData.privacyFacebook),
            'ga':privacyGoogleAnalyticsScore(auditData.privacyGoogleAnalytics),
            'https':privacyHttpsScore(auditData.privacyHTTPS),
            'surveillance':privacySurveillanceScore(auditData.privacySurveillance),
            'youtube':privacyYouTubeScore(auditData.privacyYouTube)
        }
    }
    result.score = calculatePrivacyScore(result.adviceList)
    return result
}

module.exports = {calculatePrivacyScore}