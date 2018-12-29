function handleNormalNode(cfg, node, variableValues, greenNodes){
    if(node.astNode.type === 'ReturnStatement'){
        greenNodes.push('n' + cfg.indexOf(node));
        return;
    }
    variableValues = variableValues + node.label + '\n';
    greenNodes.push('n' + cfg.indexOf(node));
    colorNode(cfg, node.normal, variableValues, greenNodes);
}

function handleTrueFalseNode(cfg, node, variableValues, greenNodes){
    greenNodes.push('n' + cfg.indexOf(node));
    eval(variableValues + node.label + '\n') ? colorNode(cfg, node.true, variableValues, greenNodes) : colorNode(cfg, node.false, variableValues, greenNodes);
}

function colorNode(cfg, node, variableValues, greenNodes){
    if(node.normal || node.astNode.type === 'ReturnStatement'){
        handleNormalNode(cfg, node, variableValues, greenNodes);
    }
    else{
        handleTrueFalseNode(cfg, node, variableValues, greenNodes);
    }
    return greenNodes;
}

export function getGreenNodes(cfg, variableValues){
    return colorNode(cfg, cfg[0], variableValues, []);
}