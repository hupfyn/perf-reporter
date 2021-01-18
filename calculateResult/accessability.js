var calculateAdviceScore = require('./calculateScore').calculateAdviceScore

function scoreForAltImage(data) {
    var score = data[0]
    var offending = data[1]
    var missing = data[2]
    var tooLong = data[3]
    var advice = ''

    function plural(value) {
        return value !== 1 ? 's' : '';
    }

    if (missing > 0) {
        advice =
            'The page has ' +
            missing +
            ' image' +
            plural(missing) +
            ' that lack alt attribute(s) and ' +
            Object.keys(offending).length +
            ' of them are unique.';
    }
    if (tooLong > 0) {
        advice +=
            'The page has ' +
            tooLong +
            ' image' +
            plural(tooLong) +
            ' where the alt text are too long (longer than 125 characters).';
    }

    return {
        id: 'altImages',
        title: 'Always use an alt attribute on image tags',
        description: 'All img tags require an alt attribute. This goes without exception. Everything else is an error.' +
            ' If you have an img tag in your HTML without an alt attribute, add it now. https://www.marcozehe.de/2015/12/14/the-web-accessibility-basics/',
        advice: advice,
        score: Math.max(0, 100 - score),
        weight: 5,
        offending: Object.keys(offending),
        tags: ['accessibility', 'images']
    };
}

function scoreForHeadings(headingData) {
    var score = 0;
    var message = '';
    var totalHeadings = 0

    headingData.forEach(function (tag) {
        totalHeadings += tag.entry
    })

    if (totalHeadings === 0) {
        score = 100;
        message = 'The page is missing headings. Use them to get a better structure of your content.';
    } else {
        var hadLowerHeading = false;
        var messages = [];

        for (var tag of headingData) {
            if (hadLowerHeading && tag.entry === 0) {
                score += 10;
                messages.push('The page is missing a ' + tag.type + ' and has heading(s) with lower priority.');
            }
            if (tag.entry > 0) {
                hadLowerHeading = true;
            }
        }
        message = messages.join(' ');
    }
    return {
        id: 'headings',
        title: 'Use heading tags to structure your page',
        description: 'Headings give your document a logical, easy to follow structure.' +
            ' Have you ever wondered how Wikipedia puts together its table of contents for each article? ' +
            'They use the logical heading structure for that, too! The H1 through H6 elements are unambiguous in telling screen readers, ' +
            'search engines and other technologies what the structure of your document is. https://www.marcozehe.de/2015/12/14/the-web-accessibility-basics/',
        advice: message,
        score: Math.max(0, 100 - score),
        weight: 4,
        offending: [],
        tags: ['accessibility', 'html']
    };
}

function scoreForLabelOnInput(data) {
    
    var score = data[0]
    var offending = data[1]

    return {
        id: 'labelOnInput',
        title: 'Always set labels on inputs in forms',
        description: 'Most input elements, as well as the select and textarea elements, need an associated label element that states their purpose.' +
            ' The only exception is those that produce a button, like the reset and submit buttons do.' +
            ' Others, be it text, checkbox, password, radio (button), search etc. require a label element to be present. https://www.marcozehe.de/2015/12/14/the-web-accessibility-basics/',
        advice: score > 0 ?
            'There are ' +
            score / 10 +
            ' input(s) that are missing labels on a form.' :
            '',
        score: Math.max(0, 100 - score),
        weight: 3,
        offending: offending,
        tags: ['accessibility', 'form']
    };
}

function scoreForLandmark(totalLandmarks) {
    return {
        id: 'landmarks',
        title: 'Structure your content by using landmarks',
        description: 'Landmarks can be article, aside, footer, header, nav or main tag. Adding such landmarks appropriately can help further provide sense to your document and help users more easily navigate it. https://www.marcozehe.de/2015/12/14/the-web-accessibility-basics/',
        advice: totalLandmarks === 0 ? "The page doesn't use any landmarks." : '',
        score: totalLandmarks > 0 ? 100 : 0,
        weight: 5,
        offending: [],
        tags: ['accessibility', 'html']
    };
}

function scoreForNeverSuppressZoom(metas) {

    var score = 100;
    var offending = [];

    metas.forEach(function (meta) {
        if (
            meta.content.indexOf('user-scalable=no') > -1 ||
            meta.content.indexOf('initial-scale=1.0; maximum-scale=1.0') > -1
        ) {
            score = 0;
            offending.push(meta.content);
        }
    });

    return {
        id: 'neverSuppressZoom',
        title: "Don't suppress pinch zoom",
        description: 'A key feature of mobile browsing is being able to zoom in to read content and out to locate content within a page.' +
            ' http://www.iheni.com/mobile-accessibility-tip-dont-suppress-pinch-zoom/',
        advice: score === 0 ?
            "What! The page suppresses zooming, you really shouldn't do that." :
            '',
        score: score,
        weight: 8,
        offending: offending,
        tags: ['accessibility']
    };
}

function scoreForSection(sectionsData) {
    var score = 0;
    var message = '';
    var totalSections = sectionsData.length;

    if (totalSections == 0) {
        message = "The page doesn't use sections. You could use them to get a better structure of your content.";
        score = 100;
    } else {
        sectionsData.forEach(function (section) {
            var hasHeading = false;
            for (const tag in section[0]) {
                var count = section[0][tag][1]
                if (count > 0) {
                    hasHeading = true
                }
            }
            if (!hasHeading) {
                score += 10
            }
        })
    }
    if (score > 0) {
        message = 'The page is missing heading(s) within a section tag on the page. ' +
            'It happens ' + score / 10 + ' times.';
    }
    return {
        id: 'sections',
        title: 'Use headings tags within section tags to better structure your page',
        description: 'Section tags should have at least one heading element as a direct descendant.',
        advice: message,
        score: Math.max(0, 100 - score),
        weight: 0,
        offending: [],
        tags: ['accessibility', 'html']
    }
}

function scoreForTable(tablesData) {
    var score = 0;
    var offending = [];

    tablesData.forEach(function (table) {
        score += 5
        offending.push(table)
    })

    return {
        id: 'table',
        title: 'Use caption and th in tables',
        description: 'Add a caption element to give the table a proper heading or summary. Use th elements to denote column and row headings.' +
            ' Make use of their scope and other attributes to clearly associate what belongs to which. https://www.marcozehe.de/2015/12/14/the-web-accessibility-basics/',
        advice: score > 0 ?
            'The page has tables that are missing caption, please use them to give them a proper heading or summary.' :
            '',
        score: Math.max(0, 100 - score),
        weight: 5,
        offending: offending,
        tags: ['accessibility', 'html']
    };
}


function calculateAccessabilityResult(auditData) {
    var result = {
        'adviceList': {
            'altImages': scoreForAltImage(auditData.altImage),
            'headings': scoreForHeadings(auditData.heading),
            'labelOnInput': scoreForLabelOnInput(auditData.labelOnInput),
            'landmarks': scoreForLandmark(auditData.landmark),
            'neverSuppressZoom': scoreForNeverSuppressZoom(auditData.neverSuppressZoom),
            'section': scoreForSection(auditData.section),
            'table': scoreForTable(auditData.table)
        }
    }    
    result.score = calculateAdviceScore(result.adviceList)
    return result
}



module.exports = { calculateAccessabilityResult }