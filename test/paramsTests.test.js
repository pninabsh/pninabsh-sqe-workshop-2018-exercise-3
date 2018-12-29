import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {resetParamValues, getParamsValues, paramValues, handleFunction, turnVeariableValueArrayToString} from '../src/js/params';

describe('Testing Params - array', () => {
    it('parsing params correctly', () => {
        resetParamValues();
        getParamsValues('1,2,3');
        let excepted = ['1','2','3'];
        assert.deepEqual(
            paramValues,
            excepted
        );
    });
});

describe('Testing Params - array', () => {
    it('Combining params names and values correctly', () => {
        resetParamValues();
        resetParamValues();
        getParamsValues('1,2,3');
        let parsedCode = parseCode('function foo(x,y,z){\nreturn 1;\n}');
        let paramsStringsArray = handleFunction(parsedCode.body[0], paramValues);
        let expected = ['var x = 1', 'var y = 2', 'var z = 3'];
        assert.deepEqual(
            paramsStringsArray,
            expected
        );
    });
});

describe('Testing Params - array', () => {
    it('Combining params names and values correctly including array values', () => {
        resetParamValues();
        resetParamValues();
        getParamsValues('1, 2,[1,2,3]');
        let parsedCode = parseCode('function foo(x,y,z){\nreturn 1;\n}');
        let paramsStringsArray = handleFunction(parsedCode.body[0], paramValues);
        let expected = ['var x = 1', 'var y = 2', 'var z = [1,2,3]'];
        assert.deepEqual(
            paramsStringsArray,
            expected
        );
    });
});

describe('Testing Params - as string', () => {
    it('Turning the array of param names and values into a string', () => {
        resetParamValues();
        resetParamValues();
        getParamsValues('1, 2,[1,2,3]');
        let parsedCode = parseCode('function foo(x,y,z){\nreturn 1;\n}');
        let paramsStringsArray = handleFunction(parsedCode.body[0], paramValues);
        let paramsString = turnVeariableValueArrayToString(paramsStringsArray);
        let expected = 'var x = 1\n' + 'var y = 2\n' + 'var z = [1,2,3]\n';
        assert.deepEqual(
            paramsString,
            expected
        );
    });
});