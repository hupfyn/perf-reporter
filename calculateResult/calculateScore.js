function calculateAdviceScore(adviceList){
    var score = 0
    var width = 0
    for (var advice in adviceList) {
        score+= adviceList[advice].score
        if (adviceList[advice].score < 100){
            width+= adviceList[advice].weight
        }
    }
    if (score / Object.keys(adviceList).length == 100){
        result = 100
    }
    else{
        score = Math.round(score / width)
        result = 100 - score
    }
    return result
}

module.exports = {calculateAdviceScore}