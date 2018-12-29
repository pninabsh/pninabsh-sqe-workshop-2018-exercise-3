import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {updateNodesLabels} from '../src/js/updateNodesNames';
import {getParamsValues, handleFunction, resetParamValues, turnVeariableValueArrayToString} from '../src/js/params';
import {cleanCFGGraph} from '../src/js/nodesHandling';
import {getGreenNodes} from '../src/js/colorCreation';
import {formCfgGraph} from '../src/js/createGraph';
const esgraph = require('esgraph');

describe('Testing graph creation', () => {
    it('color graph according to true condition', () => {
        resetParamValues();
        let parsedCode = parseCode('function foo(x, y, z){\n' + '   let a = x + 1;\n' + '   let b = a + y;\n' + '   \n' + '   if(a < z) {\n' + '       a++;\n' + '       b++;\n' + '   }\n' + '   \n' + '   let m = 2;\n' + '   m = 3;\n' + '   return z;\n' + '}');
        let paramValues = getParamsValues('1,2,3');
        const cfg = esgraph(parsedCode.body[0].body);
        let variableValues = handleFunction(parsedCode.body[0], paramValues);
        updateNodesLabels(cfg[2], variableValues);
        cfg[2] = cleanCFGGraph(cfg[2]);
        let variableValuesString = turnVeariableValueArrayToString(variableValues);
        let greenNodes = getGreenNodes(cfg[2], variableValuesString);
        const cfgDotResult = esgraph.dot(cfg);
        let resultString = formCfgGraph(cfgDotResult, greenNodes);
        let expected = 'n0=>operation: (1)\n' + 'a = x + 1\n' + 'b = a + y|current\n' + 'n1=>condition: (2)\n' + 'a < z|current\n' + 'n2=>operation: (3)\n' + 'a++\n' + 'b++|current\n' + 'n3=>operation: (4)\n' + 'm = 2\n' + 'm = 3|current\n' + 'n4=>operation: (5)\n' + 'return z|current\n' + 's0=>end: split|split\n' + '' + '\n' + 'n0->n1\n' + 'n1(yes)->n2\n' + 'n1(no)->s0\n' + 's0->n3\n' + 'n2->s0\n' + 's0->n3\n' + 'n3->n4\n' + '';
        assert.deepEqual(resultString, expected);
    });
});

describe('Testing graph creation', () => {
    it('color graph according to true condition', () => {
        resetParamValues();
        let parsedCode = parseCode('function foo(x, y, z){\n' + '   let a = x + 1;\n' + '   let b = a + y;\n' + '   \n' + '   if(a < z) {\n' + '       a++;\n' + '       b++;\n' + '   }\n' + '   \n' + '   let m = 2;\n' + '   m = 3;\n' + '   return z;\n' + '}');
        let paramValues = getParamsValues('2,2,3');
        const cfg = esgraph(parsedCode.body[0].body);
        let variableValues = handleFunction(parsedCode.body[0], paramValues);
        updateNodesLabels(cfg[2], variableValues);
        cfg[2] = cleanCFGGraph(cfg[2]);
        let variableValuesString = turnVeariableValueArrayToString(variableValues);
        let greenNodes = getGreenNodes(cfg[2], variableValuesString);
        const cfgDotResult = esgraph.dot(cfg);
        let resultString = formCfgGraph(cfgDotResult, greenNodes);
        let expected = 'n0=>operation: (1)\n' + 'a = x + 1\n' + 'b = a + y|current\n' + 'n1=>condition: (2)\n' + 'a < z|current\n' + 'n2=>operation: (3)\n' + 'a++\n' + 'b++\n' + 'n3=>operation: (4)\n' + 'm = 2\n' + 'm = 3|current\n' + 'n4=>operation: (5)\n' + 'return z|current\n' + 's0=>end: split|split\n' + '' + '\n' + 'n0->n1\n' + 'n1(yes)->n2\n' + 'n1(no)->s0\n' + 's0->n3\n' + 'n2->s0\n' + 's0->n3\n' + 'n3->n4\n' + '';
        assert.deepEqual(resultString, expected);
    });
});

describe('Testing graph creation', () => {
    it('color graph without conditions', () => {
        resetParamValues();
        let parsedCode = parseCode('function foo(x, y, z){\n' + '   let a = x + 1;\n' + '   let b = a + y;\n' + '   \n' + '   return z;\n' + '}');
        let paramValues = getParamsValues('2,2,3');
        const cfg = esgraph(parsedCode.body[0].body);
        let variableValues = handleFunction(parsedCode.body[0], paramValues);
        updateNodesLabels(cfg[2], variableValues);
        cfg[2] = cleanCFGGraph(cfg[2]);
        let variableValuesString = turnVeariableValueArrayToString(variableValues);
        let greenNodes = getGreenNodes(cfg[2], variableValuesString);
        const cfgDotResult = esgraph.dot(cfg);
        let resultString = formCfgGraph(cfgDotResult, greenNodes);
        let expected = 'n0=>operation: (1)\n' + 'a = x + 1\n' + 'b = a + y|current\n' + 'n1=>operation: (2)\n' + 'return z|current\n' + '' + '\n' + 'n0->n1\n' + '';
        assert.deepEqual(resultString, expected);
    });
});