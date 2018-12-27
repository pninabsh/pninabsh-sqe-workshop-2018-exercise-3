function deleteUnusedNodes(cfg){
    for(let cfgElement of cfg){
        cfgElement.exception = undefined;
        if(cfgElement.label.startsWith('return')){
            delete cfgElement.normal;
        }
    }
    cfg.splice(0,1);
    cfg[0].parent = undefined; cfg[0].prev = [];
    cfg.splice(cfg.length-1, cfg.length);
    return cfg;
}

function updatePrevNode(cfgElement, nextElement){
    for(let prevElement of cfgElement.prev) {
        if(prevElement.normal){
            prevElement.normal = nextElement.normal;
        }
        else if(prevElement.true){
            prevElement.true = nextElement.normal;
        }
        else if(prevElement.false){
            prevElement.false = nextElement.normal;
        }
    }
}

function mergeNodes(cfg){
    let newCfg = [];
    let minIndex = cfg.length;
    for(let i=0;i<cfg.length; i++){
        if(cfg[i].normal && cfg[i].normal.prev.length === 1 && cfg[i].normal.normal){
            if(i < minIndex){
                minIndex = i;
            }
            cfg[i].normal.label = cfg[i].label + '\n' + cfg[i].normal.label;
            updatePrevNode(cfg[minIndex], cfg[i]);
        }
        else{
            minIndex = cfg.length;
            newCfg.push(cfg[i]);
        }
    }
    return newCfg;
}

function handleNodeLine(line, conditions){
    let splittedLineArray = line.split(/\s\[/);
    let nodeName = splittedLineArray[0];
    let splittenLabel = splittedLineArray[1].split(/="/);
    let nodeValue = splittenLabel[1];
    let nodeType = conditions.includes(nodeName)?  'condition' : 'operation';
    return nodeName + '=>' + nodeType + ': ' + nodeValue.substring(0, nodeValue.length - 1) + '\n';
}

function hanleTransitions(line, conditions){
    let splittenTransitionArray = line.split(/\s->\s/);
    let firstNode = splittenTransitionArray[0];
    let splitedSecondNodeAray = splittenTransitionArray[1].split(/\s/);
    let secondNode = splitedSecondNodeAray[0];
    let splittedLabel = splitedSecondNodeAray[1].split(/=/);
    let conditionType = splittedLabel[1];
    let condition = '';
    if(conditionType){
        conditionType === '"true"' ? condition = '(yes)' : condition = '(no)';
        if(!conditions.includes(firstNode)){
            conditions.push(firstNode);
        }
    }
    return firstNode + condition +  '->'+ secondNode + '\n';
}

export function formCfgGraph (cfgDotResult) {
    let nodesString = '';
    let transitionString = '';
    let conditions = [];
    let lines = cfgDotResult.split(']\n');
    for(let line of lines){
        if(line.indexOf('->') > -1 && line !== ''){
            transitionString += hanleTransitions(line, conditions);
        }
    }
    for(let line of lines){
        if(line.indexOf('->') == -1 && line !== ''){
            nodesString += handleNodeLine(line, conditions);
        }
    }
    return nodesString + '\n' + transitionString;
}

export function cleanCFGGraph(cfg){
    deleteUnusedNodes(cfg);
    return mergeNodes(cfg);
}