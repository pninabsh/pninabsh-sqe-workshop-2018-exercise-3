import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getParamsValues, resetParamValues, handleFunction, turnVeariableValueArrayToString} from './params';
import {updateNodesLabels} from './updateNodesNames';
import {cleanCFGGraph} from './nodesHandling';
import {formCfgGraph} from './createGraph';
import * as flowchart from 'flowchart.js';
const esgraph = require('esgraph');

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        resetParamValues();
        $('#diagram').empty();
        let codeToParse = $('#codePlaceholder').val();
        let paramsValue = $('#variablesValues').val();
        let paramValues = getParamsValues(paramsValue);
        let parsedCode = parseCode(codeToParse);
        const cfg = esgraph(parsedCode.body[0].body);
        let variableValues = handleFunction(parsedCode.body[0], paramValues);
        updateNodesLabels(cfg[2], variableValues);
        cfg[2] = cleanCFGGraph(cfg[2]);
        const cfgDotResult = esgraph.dot(cfg);
        $('#parsedCode').val(cfgDotResult);
        let diagram = flowchart.parse(formCfgGraph(cfgDotResult, turnVeariableValueArrayToString(variableValues)));
        diagram.drawSVG('diagram', {'flowstate' : {
            'current' : {'fill' : 'green'},}});
    });
});
