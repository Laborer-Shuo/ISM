import * as TESTDRAW from './corps/test/draw.js';
import * as TESTLOAD from './corps/test/load.js';

function test() {
    console.log("MyScript");
}

function testDraw(_thisChartView) {
    TESTDRAW.draw(_thisChartView);
}

function testLoad(_thisChartView) {
    TESTLOAD.draw(_thisChartView);
}

export { 
    test,
    testDraw,
    testLoad
 };