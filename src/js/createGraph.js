
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

function handleNodeLine(line, conditions, counter, variableValues){
    let splittedLineArray = line.split(/\s\[/);
    let nodeName = splittedLineArray[0];
    let splittenLabel = splittedLineArray[1].split(/="/);
    let nodeValue = splittenLabel[1];
    //additional circle empty node
    if(!nodeValue){
        return nodeName + '=>' + 'end' + ': ' + 'split\n';
    }
    let nodeType;
    let nodeColor = '';
    if(conditions.includes(nodeName)){
        nodeType = 'condition';
        let variableValuesWithCondition = variableValues + nodeValue.substring(0, nodeValue.length - 1);
        if(eval(variableValuesWithCondition)){
            nodeColor = '|current';
        }
    }
    else{
        nodeType = 'operation';
    }
    return nodeName + '=>' + nodeType + ': ' + '(' + counter + ')\n' + nodeValue.substring(0, nodeValue.length - 1) + nodeColor +  '\n';
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
    let condition = '';
    if(conditionType){
        conditionType === '"true"' ? condition = '(yes)' : condition = '(no)';
        if(!conditions.includes(firstNode)){
            conditions.push(firstNode);
        }
    }
    return firstNode + condition +  '->'+ secondNode + '\n' + additionalTransition;
}

export function formCfgGraph (cfgDotResult, variableValues) {
    let nodesString = '';
    let transitionString = '';
    let conditions = [];
    let counter = 1;
    let lines = cfgDotResult.split(']\n');
    let replaceNodesArray = replaceNodeWithMultipleAccess(lines);
    for(let line of lines){
        if(line.indexOf('->') > -1 && line !== ''){
            transitionString += hanleTransitions(line, conditions, replaceNodesArray);
        }
    }
    for(let line of lines){
        if(line.indexOf('->') == -1 && line !== ''){
            nodesString += handleNodeLine(line, conditions, counter, variableValues);
            counter++;
        }
    }
    return nodesString + '\n' + transitionString + '\n';
}