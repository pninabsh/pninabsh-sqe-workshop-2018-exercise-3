import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {updateNodesLabels} from '../src/js/updateNodesNames';
import {getParamsValues, handleFunction, resetParamValues} from '../src/js/params';
import {cleanCFGGraph} from '../src/js/nodesHandling';
const esgraph = require('esgraph');

describe('Testing Nodes', () => {
    it('giving labels to all nodes correctly', () => {
        resetParamValues();
        let parsedCode = parseCode('function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c;\n' + '    let m = [1,2,3];\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '    } \n' + '    return c;\n' + '}');
        let paramValues = getParamsValues('1,2,3');
        const cfg = esgraph(parsedCode.body[0].body);
        let variableValues = handleFunction(parsedCode.body[0], paramValues);
        updateNodesLabels(cfg[2], variableValues);
        cfg[2] = cleanCFGGraph(cfg[2]);
        let excepted = ['a = x + 1\nb = a + y\nc\nm = [1,2,3]', 'b < z', 'c = c + 5', 'return c'];
        for(let i = 0; i < cfg[2].length; i++){
            assert.deepEqual(cfg[2][i].label, excepted[i]);
        }
    });
});

describe('Testing Nodes', () => {
    it('giving labels to all nodes correctly with merging nodes inside an if', () => {
        resetParamValues();
        let parsedCode = parseCode('function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    let m = [1,2,3];\n' + '    c = 1;\n' + '    m[1] = 2;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '        b = b + 2;\n' + '        b++;\n'       + '        ++b;\n'       + '        \n' + '    } \n' + '    return -1;\n' + '}');
        let paramValues = getParamsValues('1,2,3');
        const cfg = esgraph(parsedCode.body[0].body);
        let variableValues = handleFunction(parsedCode.body[0], paramValues);
        updateNodesLabels(cfg[2], variableValues);
        cfg[2] = cleanCFGGraph(cfg[2]);
        let excepted = ['a = x + 1\nb = a + y\nc = 0\nm = [1,2,3]\nc = 1\nm[1] = 2', 'b < z', 'c = c + 5\nb = b + 2\nb++\n++b', 'return -1'];
        for(let i = 0; i < cfg[2].length; i++){
            assert.deepEqual(cfg[2][i].label, excepted[i]);
        }
    });
});

describe('Testing Nodes', () => {
    it('giving labels to all nodes correctly with merging nodes inside an if with block before a return', () => {
        resetParamValues();
        let parsedCode = parseCode('function foo(x, y, z){\n' + '   let a = x + 1;\n' + '   let b = a + y;\n' + '   let c = 0;\n' + '   \n' + '   if(a < z) {\n' + '       a++;\n' + '       b++;\n' + '   }\n' + '   \n' + '   let a = 2;\n' + '   a = 3;\n' + '   return z;\n' + '}\n');
        let paramValues = getParamsValues('1,2,3');
        const cfg = esgraph(parsedCode.body[0].body);
        let variableValues = handleFunction(parsedCode.body[0], paramValues);
        updateNodesLabels(cfg[2], variableValues);
        cfg[2] = cleanCFGGraph(cfg[2]);
        let excepted = ['a = x + 1\nb = a + y\nc = 0', 'a < z', 'a++\nb++', 'a = 2\na = 3', 'return z'];
        for(let i = 0; i < cfg[2].length; i++){
            assert.deepEqual(cfg[2][i].label, excepted[i]);
        }
    });
});

describe('Testing Nodes', () => {
    it('giving labels to all nodes correctly with merging nodes inside an if and inside of an else if statement', () => {
        resetParamValues();
        let parsedCode = parseCode('function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '        a++;\n' + '    } else if (b < z * 2) {\n' + '        c = c + x + 5;\n' + '        a++;\n' + '    } else {\n' + '        c = c + z + 5;\n' + '        c = 2;\n' + '    }\n' + '    \n' + '    m = n;\n' + '    a = a + 2;\n' + '    return c;\n' + '}');
        let paramValues = getParamsValues('1,2,3');
        const cfg = esgraph(parsedCode.body[0].body);
        let variableValues = handleFunction(parsedCode.body[0], paramValues);
        updateNodesLabels(cfg[2], variableValues);
        cfg[2] = cleanCFGGraph(cfg[2]);
        let excepted = ['a = x + 1\nb = a + y\nc = 0', 'b < z', 'c = c + 5\na++', 'm = n\na = a + 2' ,'return c', 'b < z * 2', 'c = c + x + 5\na++', 'c = c + z + 5\nc = 2'];
        for(let i = 0; i < cfg[2].length; i++){
            assert.deepEqual(cfg[2][i].label, excepted[i]);
        }
    });
});