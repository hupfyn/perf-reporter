var calculateAdviceScore = require('./calculateScore').calculateAdviceScore

function scoreForCharset(charSet) {
    var score = 100;
    var message = '';

    if (charSet === null) {
        message =
            'The page is missing a character set. If you use Chrome/Firefox we know you are missing it, if you use another browser, it could be an implementation problem.';
        score = 0;
    } else if (charSet !== 'UTF-8') {
        message = 'You are not using charset UTF-8?';
        score = 50;
    }

    return {
        id: 'charset',
        title: 'Declare a charset in your document',
        description: 'The Unicode Standard (UTF-8) covers (almost) all the characters, punctuations, and symbols in the world. Please use that.',
        advice: message,
        score: score,
        weight: 2,
        offending: [],
        tags: ['bestpractice']
    };
}

function scoreForDockType(data) {
    var score = 100;
    var message = '';

    if (data[0] === null) {
        message = 'The page is missing a doctype. Please use <!DOCTYPE html>.';
        score = 0;
    } else if (
        !(data[1].toLowerCase() === 'html' && (data[2] === '' || data[2].toLowerCase() === 'about:legacy-compat'))
    ) {
        message = 'Just do yourself a favor and use the HTML5 doctype declaration: <!DOCTYPE html>';
        score = 25;
    }

    return {
        id: 'doctype',
        title: 'Declare a doctype in your document',
        description: 'The <!DOCTYPE> declaration is not an HTML tag; it is an instruction to the web browser about what version of HTML the page is written in.',
        advice: message,
        score: score,
        weight: 2,
        offending: [],
        tags: ['bestpractice']
    };
}

function scoreForHttpsH2(data) {
    var url = data.url
    var connectionType = data.connectionType
    var score = 100;
    var message = '';

    if (url.indexOf('https://') > -1 && connectionType.indexOf('h2') === -1) {
        score = 0;
        message =
            'The page is using HTTPS but not HTTP/2. Change to HTTP/2 to follow new best practice with compressed headers and maybe make the site faster.';
    }

    return {
        id: 'httpsH2',
        title: 'Serve your content using HTTP/2',
        description: 'Using HTTP/2 together with HTTPS is the new best practice. ' +
            'If you use HTTPS (you should), you should also use HTTP/2 since you will then get compressed headers. ' +
            'However it may not be faster for all users.',
        advice: message,
        score: score,
        weight: 2,
        offending: [],
        tags: ['bestpractice']
    };
}

function scoreLanguage(data) {
    var score = 100;
    var language = data.language
    var message = '';

    if (data.length > 0) {
        if (language === null) {
            score = 0;
            message =
                'The page is missing a language definition in the HTML tag. Define it with <html lang="YOUR_LANGUAGE_CODE">';
        }
    } else {
        score = 0;
        message = 'What! The page is missing the HTML tag!';
    }

    return {
        id: 'language',
        title: 'Declare the language code for your document',
        description: 'According to the W3C recommendation you should declare the primary language for each Web page with the lang attribute inside the <html> tag https://www.w3.org/International/questions/qa-html-language-declarations#basics.',
        advice: message,
        score: score,
        weight: 3,
        offending: [],
        tags: ['bestpractice']
    };
}

function scoreMetaDescription(description) {

    var maxLength = 155;
    var score = 100;
    var message = '';

    if (description.length === 0) {
        message = 'The page is missing a meta description.';
        score = 0;
    } else if (description.length > maxLength) {
        message =
            'The meta description is too long. It has ' +
            description.length +
            ' characters, the recommended max is ' +
            maxLength;
        score = 50;
    }

    return {
        id: 'metaDescription',
        title: 'Meta description',
        description: 'Use a page description to make the page more relevant to search engines.',
        advice: message,
        score: score,
        weight: 5,
        offending: [],
        tags: ['bestpractice']
    };
}

function scoreOptimizely(bestPracticeOpimizely) {
    var score = 100;
    var advice = '';
    var offending = [];

    bestPracticeOpimizely.forEach(function (record) {
        if (record.hostname === 'cdn.optimizely.com') {
            offending.push(record.script)
            offending.push(script);
            score = 0;
            advice = 'The page is using Optimizely.' +
                ' Use it with care because it hurts your performance.' +
                ' Only turn it on (= load the JavaScript) when you run your A/B tests.' +
                ' Then when you are finished make sure to turn it off.';
        }
    })

    return {
        id: 'optimizely',
        title: 'Only use Optimizely when you need it',
        description: 'Use Optimizely with care because it hurts your performance since Javascript is loaded synchronously inside of the head tag, making the first paint happen later. Only turn on Optimzely (= load the javascript) when you run your A/B tests.',
        advice: advice,
        score: score,
        weight: 2,
        offending: offending,
        tags: ['bestpractice']
    };
}

function scorePageTitle(title) {
    var max = 60;
    var score = 100;
    var message = '';

    if (title.length === 0) {
        message = 'The page is missing a title.';
        score = 0;
    } else if (title.length > max) {
        message =
            'The title is too long by ' +
            (title.length - max) +
            ' characters. The recommended max is ' +
            max;
        score = 50;
    }

    return {
        id: 'pageTitle',
        title: 'Page title',
        description: 'Use a title to make the page more relevant to search engines.',
        advice: message,
        score: score,
        weight: 5,
        offending: [],
        tags: ['bestpractice']
    };
}

function scoreSPDY(connectionType) {
    var score = 100;
    var message = '';

    if (connectionType.indexOf('spdy') !== -1) {
        score = 0;
        message =
            'The page is using SPDY. Chrome dropped support for SPDY in Chrome 51. Change to HTTP/2 asap.';
    }

    return {
        id: 'spdy',
        title: 'EOL for SPDY in Chrome',
        description: 'Chrome dropped supports for SPDY in Chrome 51, upgrade to HTTP/2 as soon as possible. The page has more users (browsers) supporting HTTP/2 than supports SPDY.',
        advice: message,
        score: score,
        weight: 1,
        offending: [],
        tags: ['bestpractice']
    };
}

function scorePageURL(url) {
    var score = 100;
    var message = '';

    if (url.indexOf('?') > -1 && url.indexOf('jsessionid') > url.indexOf('?')) {
        score = 0;
        message =
            'The page has the session id for the user as a parameter, please change so the session handling is done only with cookies. ';
    }

    var parameters = (url.match(/&/g) || []).length;
    if (parameters > 1) {
        score -= 50;
        message +=
            'The page is using more than two request parameters. You should really rethink and try to minimize the number of parameters. ';
    }

    if (url.length > 100) {
        score -= 10;
        message +=
            'The URL is ' +
            url.length +
            ' characters long. Try to make it less than 100 characters. ';
    }

    if (url.indexOf(' ') > -1 || url.indexOf('%20') > -1) {
        score -= 10;
        message +=
            'Could the developer or the CMS be on Windows? Avoid using spaces in the URLs, use hyphens or underscores. ';
    }

    return {
        id: 'url',
        title: 'Have a good URL format',
        description: 'A clean URL is good for the user and for SEO. Make them human readable, avoid too long URLs, spaces in the URL, too many request parameters, and never ever have the session id in your URL.',
        advice: message,
        score: score < 0 ? 0 : score,
        weight: 2,
        offending: [],
        tags: ['bestpractice']
    };
}

function calculateBestPracticeResult(auditData){
    var result =  {
        'adviceList': {
            'charset': scoreForCharset(auditData.bestPracticeCharset),
            'doctype': scoreForDockType(auditData.bestPracticeDoctype),
            'httpsH2': scoreForHttpsH2(auditData.bestPracticeHttpsH2),
            'language': scoreLanguage(auditData.bestPracticeLanguage),
            'metaDescription': scoreMetaDescription(auditData.bestPracticeMetaDescription),
            'optimizely': scoreOptimizely(auditData.bestPracticeOpimizely),
            'pageTitle': scorePageTitle(auditData.bestPracticePageTitle),
            'spdy':scoreSPDY(auditData.bestPracticeSPDY),
            'url':scorePageURL(auditData.bestPracticePageURL)
        }
    }
    result.score = calculateAdviceScore(result.adviceList)
    return result
}


module.exports = {calculateBestPracticeResult}