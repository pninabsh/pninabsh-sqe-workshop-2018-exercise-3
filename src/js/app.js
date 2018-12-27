import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getParamsValues, resetParamValues} from './params';
import {updateNodesLabels} from './updateNodesNames';
import {cleanCFGGraph, formCfgGraph} from './nodesHandling';
import * as flowchart from 'flowchart.js';
const esgraph = require('esgraph');

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        resetParamValues();
        let codeToParse = $('#codePlaceholder').val();
        let paramsValue = $('#variablesValues').val();
        getParamsValues(paramsValue);
        let parsedCode = parseCode(codeToParse);
        const cfg = esgraph(parsedCode.body[0].body);
        updateNodesLabels(cfg[2]);
        cfg[2] = cleanCFGGraph(cfg[2]);
        const cfgDotResult = esgraph.dot(cfg);
        $('#parsedCode').val(cfgDotResult);
        let diagram = flowchart.parse(formCfgGraph(cfgDotResult));
        diagram.drawSVG('diagram');
    });
});
