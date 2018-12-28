export let paramValues = [];

export function resetParamValues(){
    paramValues = [];
}

export function handleFunction(exp, paramsValue){
    let variableValues = [];
    let i = 0;
    for (let param of exp.params) {
        let varValueString = 'var ' + param.name + ' = ' + paramsValue[i];
        variableValues.push(varValueString);
        i++;
    }
    return variableValues;
}

export function getParamsValues(paramsString){
    const i = 0;
    if(paramsString.length > 0 && paramsString.charAt(i) === ' '){
        getParamsValues(paramsString.substring(1));
    }
    else if(paramsString.length > 0 && paramsString.charAt(i) === '['){
        handleArray(paramsString, i);
    }
    else{
        handleRegularLiteral(paramsString, i);
    }
    return paramValues;
}

function handleArray(paramsString, i){
    while(i < paramsString.length && paramsString.charAt(i) !== ']'){
        i++;
    }
    paramValues.push(paramsString.substring(0, i+1));
    getParamsValues(paramsString.substring(i+1));
}

function handleRegularLiteral(paramsString, i){
    if(paramsString.length > 0) {
        while (i < paramsString.length && paramsString.charAt(i) !== ',') {
            i++;
        }
        paramValues.push(paramsString.substring(0, i));
        getParamsValues(paramsString.substring(i + 1));
    }
}

export function turnVeariableValueArrayToString(variableValues){
    let stringRes = '';
    for(let variableValue of variableValues){
        stringRes = stringRes + variableValue + '\n';
    }
    return stringRes;
}