const handleAstNodesExpression = {
    Literal: handleLiteral,
    Identifier: handleIdentifier,
    UpdateExpression: handleUpdateExpression,
    ArrayExpression: handleArrayExpression,
    ExpressionStatement: handleExpressionStatement,
    VariableDeclaration: handleVariableDeclaration,
    BinaryExpression: handleBinaryExpression,
    UnaryExpression: handleUnaryExpression,
    MemberExpression: handleMemberExpression,
    ReturnStatement: handleReturnStatement,
    AssignmentExpression: handleAssignmentExpression,
    BlockStatement: handleUnnecessaryTypes
};

function handleUnnecessaryTypes(astNode){
    return 'BlockStatement' + astNode;
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

function handleVariableDeclaration(astNode){
    let declaration = astNode.declarations[0];
    return declaration.id.name + (declaration.init == null ? '' : ' = ' + getRepresentingString(declaration.init));
}

function handleExpressionStatement(astNode){
    return getRepresentingString(astNode.expression.left) + ' = ' + getRepresentingString(astNode.expression.right);
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

function getRepresentingString(astNode){
    if(astNode){
        return handleAstNodesExpression[astNode.type](astNode);
    }
    return '';
}

function updateNodesLabels(cfg){
    for(let node of cfg){
        node.label = getRepresentingString(node.astNode);
    }
}
export {updateNodesLabels};