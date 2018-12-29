
function replaceNodeWithMultipleAccess(lines){
    let secondNodes = [];
    let result = [];
    let counter = 0;
    for(let line of lines) {
        if (line.indexOf('->') > -1 && line !== '') {
            let splittenTransitionArray = line.split(/\s->\s/);
            let secondNode = splittenTransitionArray[1].split(/\s/)[0];
            if(secondNodes.includes(secondNode)){
                lines.push('s' + counter + ' []\n');
                result.push({before: secondNode, after: 's' + counter});
                counter++;
            }
            else{
                secondNodes.push(secondNode);
            }
        }
    }
    return result;
}

function handleNodeLine(line, conditions, counter, flowNodes){
    let splittedLineArray = line.indexOf('label') > -1 ? line.split(/\s\[label/) : line.split(/\s\[/);
    let nodeName = splittedLineArray[0];
    let splittenLabel = splittedLineArray[1].split(/="/);
    let nodeValue = splittenLabel[1];
    //additional circle empty node
    if(!nodeValue){
        return nodeName + '=>' + 'end' + ': ' + 'split|split\n';
    }
    let nodeType = conditions.includes(nodeName)? 'condition' : 'operation';
    let nodeColor = flowNodes.includes(nodeName)? '|current' : '';
    return nodeName + '=>' + nodeType + ': ' + '(' + counter + ')\n' + nodeValue + nodeColor +  '\n';
}

function handleConditionType(conditionType, conditions, firstNode){
    let condition = '';
    if(conditionType){
        conditionType === '"true"' ? condition = '(yes)' : condition = '(no)';
        if(!conditions.includes(firstNode)){
            conditions.push(firstNode);
        }
    }
    return condition;
}

function hanleTransitions(line, conditions, replaceNodesArray){
    let splittenTransitionArray = line.split(/\s->\s/);
    let firstNode = splittenTransitionArray[0];
    let splitedSecondNodeAray = splittenTransitionArray[1].split(/\s/);
    let secondNode = splitedSecondNodeAray[0];
    let additionalTransition = '';
    for(let replaceNode of replaceNodesArray){
        if(replaceNode.before === secondNode){
            secondNode = replaceNode.after;
            additionalTransition = replaceNode.after + '->' + replaceNode.before + '\n';
        }
    }
    let splittedLabel = splitedSecondNodeAray[1].split(/=/);
    let conditionType = splittedLabel[1];
    let condition = handleConditionType(conditionType, conditions, firstNode);
    return firstNode + condition +  '->'+ secondNode + '\n' + additionalTransition;
}

function handleTransitionsLines(lines, conditions, replaceNodesArray){
    let transitionString = '';
    for(let line of lines){
        if(line.indexOf('->') > -1 && line !== ''){
            transitionString += hanleTransitions(line, conditions, replaceNodesArray);
        }
    }
    return transitionString;
}

function handleNodesLines(lines, conditions, greenNodes){
    let counter = 1;
    let nodesString = '';
    for(let line of lines){
        if(line.indexOf('->') === -1 && line !== ''){
            nodesString += handleNodeLine(line, conditions, counter, greenNodes);
            counter++;
        }
    }
    return nodesString;
}

function findSeparatingIndex(cfgDotResult){
    let arrowIndex = cfgDotResult.indexOf('->');
    let maxIndex = 0;
    for(let i = 0; i < arrowIndex; i++){
        if(cfgDotResult.charAt(i) === '\n'){
            maxIndex = i;
        }
    }
    return maxIndex;
}

export function formCfgGraph (cfgDotResult, greenNodes) {
    let conditions = [];
    let separatingIndex = findSeparatingIndex(cfgDotResult);
    let nodesRepresentingString = cfgDotResult.substring(0, separatingIndex + 1);
    let transitionsString = cfgDotResult.substring(separatingIndex + 1, cfgDotResult.length);
    let lines = nodesRepresentingString.split('"]\n');
    let transitionsArray = transitionsString.split(']\n');
    for(let transition of transitionsArray){
        lines.push(transition);
    }
    let replaceNodesArray = replaceNodeWithMultipleAccess(lines);
    let transitionString = handleTransitionsLines(lines, conditions, replaceNodesArray);
    let nodesString = handleNodesLines(lines, conditions, greenNodes);
    return nodesString + '\n' + transitionString;
}