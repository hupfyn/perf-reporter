var calculateAdviceScore = require('./calculateScore').calculateAdviceScore

function avoidScalingImages(offending) {
    var score = offending === null ? 0 : offending.length * 10
    var message = ''
    if (score > 0) {
        message =
            'The page has ' +
            score / 10 +
            ' image(s) that are scaled more than ' +
            100 +
            " pixels. It would be better if those images are sent so the browser don't need to scale them.";
    }

    return {
        id: 'avoidScalingImages',
        title: "Don't scale images in the browser",
        description:
            "It's easy to scale images in the browser and make sure they look good in different devices, however that is bad for performance! Scaling images in the browser takes extra CPU time and will hurt performance on mobile. And the user will download extra kilobytes (sometimes megabytes) of data that could be avoided. Don't do that, make sure you create multiple version of the same image server-side and serve the appropriate one.",
        advice: message,
        score: Math.max(0, 100 - score),
        weight: 5,
        offending: offending,
        tags: ['performance', 'image']
    };

}

function cssPint(offending) {
    var score = offending.length * 10;

    return {
        id: 'cssPrint',
        title: 'Do not load specific print stylesheets.',
        description:
            'Loading a specific stylesheet for printing slows down the page, even though it is not used. You can include the print styles inside your other CSS file(s) just by using an @media query targeting type print.',
        advice:
            offending.length > 0
                ? 'The page has ' +
                offending.length +
                ' print stylesheets. You should include that stylesheet using @media type print instead.'
                : '',
        score: Math.max(0, 100 - score),
        weight: 1,
        offending: offending,
        tags: ['performance', 'css']
    }
}

function fastRender(data){
    var score = data[0]
    var message = data[1]
    var offending = data[2]
    return {
        id: 'fastRender',
        title: 'Avoid slowing down the critical rendering path',
        description:
          'The critical rendering path is what the browser needs to do to start rendering the page. Every file requested inside of the head element will postpone the rendering of the page, because the browser need to do the request. Avoid loading JavaScript synchronously inside of the head (you should not need JavaScript to render the page), request files from the same domain as the main document (to avoid DNS lookups) and inline CSS or use server push for really fast rendering and a short rendering path.',
        advice: message,
        score: Math.max(0, 100 - score),
        weight: 10,
        offending: offending,
        tags: ['performance']
      };
}

function googleTagManager(google_tag_manager) {
    var score = 100;
    if (!google_tag_manager) {
        score = 0;
    }

    return {
        id: 'googletagmanager',
        title: 'Avoid using Google Tag Manager',
        description:
            'Google Tag Manager makes it possible for non tech users to add scripts to your page that will downgrade performance.',
        advice:
            score === 0
                ? 'The page is using Google Tag Manager, this is a performance risk since non-tech users can add JavaScript to your page.'
                : '',
        score: score,
        weight: 5,
        offending: [],
        tags: ['performance', 'js']
    };
}

function inlineCSS(data) {
    var score = data[0]
    var message = data[1]
    var offending = data[2]
    return {
        id: 'inlineCss',
        title: 'Inline CSS for faster first render',
        description:
            'In the early days of the Internet, inlining CSS was one of the ugliest things you can do. That has changed if you want your page to start rendering fast for your user. Always inline the critical CSS when you use HTTP/1 and HTTP/2 (avoid doing CSS requests that block rendering) and lazy load and cache the rest of the CSS. It is a little more complicated when using HTTP/2. Does your server support HTTP push? Then maybe that can help. Do you have a lot of users on a slow connection and are serving large chunks of HTML? Then it could be better to use the inline technique, becasue some servers always prioritize HTML content over CSS so the user needs to download the HTML first, before the CSS is downloaded.',
        advice: message,
        score: Math.max(0, 100 - score),
        weight: 7,
        offending: offending,
        tags: ['performance', 'css']
    };
}

function scoreJQuery(versions) {
    return {
        id: 'jquery',
        title: 'Avoid using more than one jQuery version per page',
        description:
            "There are sites out there that use multiple versions of jQuery on the same page. You shouldn't do that because the user will then unnecessarily download extra data. Cleanup the code and make sure you only use one version.",
        advice:
            versions.length > 1
                ? 'The page uses ' +
                versions.length +
                ' versions of jQuery! You only need one version, please remove the unnecessary version(s).'
                : '',
        score: versions.length > 1 ? 0 : 100,
        weight: 4,
        offending: versions,
        tags: ['jQuery', 'performance']
    };
}

function scoreSPOF(data) {
    var score = data[0]
    var offending = data[1]

    return {
        id: 'spof',
        title: 'Avoid Frontend single point of failures',
        description:
            "A page can be stopped from loading in the browser if a single JavaScript, CSS, and in some cases a font, couldn't be fetched or is loading really slowly (the white screen of death). That is a scenario you really want to avoid. Never load 3rd-party components synchronously inside of the head tag.",
        advice:
            offending.length > 0
                ? 'The page has ' +
                offending.length +
                ' requests inside of the head that can cause a SPOF (single point of failure). Load them asynchronously or move them outside of the document head.'
                : '',
        score: Math.max(0, 100 - score),
        weight: 7,
        offending: offending,
        tags: ['performance', 'css', 'js']
    };
}

function scoreThirdPartyAsyncJs(data) {
    var score = data[0]
    var offending = data[1]
    return {
        id: 'thirdPartyAsyncJs',
        title: 'Always load third-party JavaScript asynchronously',
        description:
            'Use JavaScript snippets that load the JS files asynchronously in order to speed up the user experience and avoid blocking the initial load.',
        advice:
            offending.length > 0
                ? 'The page has ' +
                offending.length +
                ' synchronous 3rd-party JavaScript request(s). Change it to be asynchronous instead.'
                : '',
        score: Math.max(0, 100 - score),
        weight: 5,
        offending: offending,
        tags: ['performance', 'js']
    };
}

function calculatePerformanceResult(auditData){
    var result =  {
        'adviceList': {
            'avoidScalingImages':avoidScalingImages(auditData.performanceScalingImages),
            'cssPrint':cssPint(auditData.performanceCssPrint),
            'fastRender':fastRender(auditData.performanceFastRender),
            'googletagmanager':googleTagManager(auditData.performanceGoogleTagManager),
            'inlineCss':inlineCSS(auditData.performanceInlineCss),
            'jquery':scoreJQuery(auditData.performanceJQuery),
            'spof':scoreSPOF(auditData.performanceSPOF),
            'thirdPartyAsyncJs':scoreThirdPartyAsyncJs(auditData.performanceThirdPartyAsyncJs)
        }
    }
    result.score = calculateAdviceScore(result.adviceList)
    return result
}

module.exports = {calculatePerformanceResult}