const handleAstNodesExpression = {
    Literal: handleLiteral,
    Identifier: handleIdentifier,
    UpdateExpression: handleUpdateExpression,
    ArrayExpression: handleArrayExpression,
    VariableDeclaration: handleVariableDeclaration,
    BinaryExpression: handleBinaryExpression,
    UnaryExpression: handleUnaryExpression,
    MemberExpression: handleMemberExpression,
    ReturnStatement: handleReturnStatement,
    AssignmentExpression: handleAssignmentExpression,
    BlockStatement: handleUnnecessaryTypes
};

function handleUnnecessaryTypes(){
    return 'BlockStatement';
}

function handleAssignmentExpression(astNode){
    return getRepresentingString(astNode.left) + ' = ' + getRepresentingString(astNode.right);
}

function handleArrayExpression(astNode){
    let valuesArrays = [];
    for(let arrayElement of astNode.elements){
        valuesArrays.push(getRepresentingString(arrayElement));
    }
    return '[' + valuesArrays.join(',') + ']';
}

function handleVariableDeclaration(astNode, variableValues){
    let declaration = astNode.declarations[0];
    let declarationString = declaration.id.name + (declaration.init == null ? '' : ' = ' + getRepresentingString(declaration.init));
    variableValues.push('let ' + declarationString);
    return declarationString;
}

function handleReturnStatement(astNode){
    return 'return ' + getRepresentingString(astNode.argument);
}

function handleUpdateExpression(astNode){
    return astNode.prefix ? astNode.operator + '' + astNode.argument.name : astNode.argument.name + '' + astNode.operator;
}

function handleLiteral(astNode){
    return astNode.value + '';
}

function handleIdentifier(astNode){
    return astNode.name + '';
}

function handleMemberExpression(astNode){
    return getRepresentingString(astNode.object) + '[' + getRepresentingString(astNode.property) + ']';
}

function handleUnaryExpression(astNode){
    return astNode.operator + '' + getRepresentingString(astNode.argument);
}

function handleBinaryExpression(astNode){
    return getRepresentingString(astNode.left) + ' ' + astNode.operator + ' ' + getRepresentingString(astNode.right);
}

function getRepresentingString(astNode, variableValues){
    if(astNode){
        return handleAstNodesExpression[astNode.type](astNode, variableValues);
    }
    return '';
}

function updateNodesLabels(cfg, variableValues){
    for(let node of cfg){
        node.label = getRepresentingString(node.astNode, variableValues);
    }
}
export {updateNodesLabels};