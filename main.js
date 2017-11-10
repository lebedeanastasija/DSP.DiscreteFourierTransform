let colors = ["red", "brown", "blue", "purple", "yellow", "orange", "gray", "green", "crimson", "lavender", "indigo",
    "moccasin", "orchid", "plum", "silver", "tan", "red", "brown", "blue", "purple", "yellow", "orange",
    "gray", "green", "crimson", "lavender", "indigo", "moccasin", "orchid", "plum", "silver", "tan"];

let svgContainer,
    svgWidth = 3900,
    svgHeight = 700,
    svgMargin = {
        top: 20,
        right: 50,
        bottom: 20,
        left: 50
    },
    startPoint = {
        x: svgMargin.left*2,
        y: Math.round((svgMargin.top + svgHeight)/2)
    },
    xAxisLength = 3850,
    yAxisLength = 650,
    scale = 30;

let N = 256;
let phase = Math.PI / 24;
let A = 10;
let f = 1;
let TSIN;

let signalVector = [];
let signalWithPhaseVector = [];
let fourierParams = [];
let fourierWithPhaseParams = [];

let amplitudes = [1, 3, 5, 8, 10, 12, 16];
let phases = [Math.PI / 6, Math.PI / 4, Math.PI /3, Math.PI / 2, 3* Math.PI / 4, Math.PI];
let polyharmonicVector = [];


function init() {
    drawSvgContainer(svgWidth, svgHeight, svgMargin);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale);
    TSIN = getSinTable(1, N);
    task1();
}

function task1() {

    signalVector = [];
    signalWithPhaseVector = [];
    fourierParams = [];
    fourierWithPhaseParams = [];
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale, 1);

    let signal = getHarmonicSignalVector(0, A, N, N, f);
    let phaseSignal = getHarmonicSignalVector(phase, A, N, N, f);
    signalVector.push(signal);
    signalWithPhaseVector.push(phaseSignal);

    fourierParams = [];
    for(let i = 0; i < N / 2; i++) {
        let fourierParam = getDiscreteFourier(i, signalVector[0], N);
        //let fourierWithPhaseParam = getDiscreteFourier(i, signalVector[0], N);
        fourierParams.push(fourierParam);
        //fourierWithPhaseParams.push(fourierWithPhaseParam);
    }
    debugger;
    drawFunctionGraph(signal, colors[5], 1, scale, 1);
    //drawFunctionGraph(phaseSignal, colors[5], 3, scale, 1);
}

function task2() {
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale, scale);
    drawFunctionGraph([ {x: f, y: 0}, {x: f, y: fourierParams[1].y}], colors[10], 1, scale, scale);
}

function task3() {
    debugger;
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale * 1000000000000000, scale);
    drawFunctionGraph([{x: f, y: 0}, {x: f, y: fourierParams[1].phi}], colors[10], 1, scale * 1000000000000000, scale);
}

function task4() {
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale, 1);
    let rebuilt = getRebuiltSignalVector(fourierParams, N, N);
    drawFunctionGraph(signalVector[0], colors[5], 6, scale, 1);
    drawFunctionGraph(rebuilt, colors[2], 1, scale, 1);
}

function task5() {
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale / 30, 3);
    let polyharmonicSignal = polyharmonicSignalVector(phases, amplitudes, 30, N, N * 3, 1);
    polyharmonicVector.push(polyharmonicSignal);

    fourierParams = [];
    for(let i = 0; i < N / 2; i++) {
        let fourierParam = getDiscreteFourier(i, polyharmonicSignal, N);
        fourierParams.push(fourierParam);
    }
    drawFunctionGraph(polyharmonicSignal, colors[13], 3, scale / 30, 3);
}

function task6() {
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale / 3, scale);
    for(let i = 1; i < N/2; i++) {
        drawFunctionGraph([ {x: i, y: 0}, {x: i, y: fourierParams[i].y}], colors[10], 1, scale / 3, scale);
    }
}

function task7() {
    debugger;
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale * 6, scale);
    for(let i = 1; i < N/2; i++) {
        drawFunctionGraph([{x: i, y: 0}, {x: i, y: fourierParams[i].phi}], colors[10], 1, scale * 6, scale);
    }
}

function task8() {
    clearSvgContainer(svgContainer);
    drawAxes(xAxisLength, yAxisLength, startPoint, scale / 50, 3);
    let rebuiltWithPhase = getRebuiltPolyharmonicSignalVector(fourierParams, N, N * 3, 1);
    let rebuilt = getRebuiltPolyharmonicSignalVector(fourierParams, N, N * 3, 0);
    drawFunctionGraph(rebuiltWithPhase, colors[13], 3, scale / 50, 3);
    drawFunctionGraph(rebuilt, colors[2], 1, scale / 50, 3);
}

function getHarmonicSignalVector(initPhase, amplitude, period, count, oscillation) {
    let result = [];
    for(let n = 0; n < count; n++) {
        let y = harmonicSignal(initPhase, amplitude, period, oscillation, n);
        result.push({y: y, x: n});
    }
    return result;
}

function harmonicSignal(initPhase, amplitude, period, oscillation, n) {
    //A = 10
    //initPhase = 0
    //oscillation = 1
    return amplitude * Math.cos((2 * Math.PI * oscillation * n) / period - initPhase);
}

function getRebuiltSignalVector(fourierInfo, period, count) {
    let result = [];
    debugger;
    for(let n = 0; n < count; n++) {
        let y = rebuiltSignal(fourierInfo, N, n);
        result.push({y: y, x: n});
    }
    return result;
}

function rebuiltSignal(fourierInfo, period, n) {
    let result = 0;
    fourierInfo.forEach((info, harmonicNumber) => {
        let temp = info.y * Math.cos(2 * Math.PI * harmonicNumber * n / period - info.phi);
        if(!isNaN(temp)) {
            result += temp;
        }
    });
    return result;
}

function polyharmonicSignalVector(initPhases, amplitudes, harmonicsNumber, period, count, oscillation) {
    let result = [];
    for(let n = 0; n < count; n++) {
        let y = 0;
        for (let k = 0; k < harmonicsNumber; k++) {
            let paseIndex = Math.round(Math.random() * (initPhases.length-1));
            let amplitudeIndex = Math.round(Math.random() * (amplitudes.length-1));
            y += harmonicSignal(initPhases[paseIndex], amplitudes[amplitudeIndex], period, k, n);
        }
        result.push({y: y, x: n})
    }
    return result;
}

function getRebuiltPolyharmonicSignalVector(fourierInfo, period, count, withPhase) {
    let result = [];
    debugger;
    for(let n = 0; n < count; n++) {
        let y = rebuiltPolyharmonicSignal(fourierInfo, N, n, withPhase);
        result.push({y: y, x: n});
    }
    return result;
}

//param withPhase  - equal to 1 or 0
function rebuiltPolyharmonicSignal(fourierInfo, period, n, withPhase) {
    let result = 0;
    fourierInfo.forEach((info, harmonicNumber) => {
        if(harmonicNumber !== 0) {
            let temp = info.y * Math.cos(2 * Math.PI * harmonicNumber * n / period - info.phi * withPhase);
            if(!isNaN(temp)) {
                result += temp;
            }
        } else {
            result += info.y / 2;
        }
    });
    return result;
}

function getDiscreteFourier(harmonicNumber, signalVector, period) {
    let result = {};
    let aSin = 0;
    let aCos = 0;
    let a;
    let phi;
    signalVector.forEach((s, i) => {
        aSin += s.y * TSIN[(i * harmonicNumber)% period];
        aCos += s.y * TSIN[(i * harmonicNumber + period / 4)% period];
    });
    aSin = aSin * (2 / N);
    aCos = aCos * (2 / N);
    a = Math.sqrt(Math.pow(aSin, 2) + Math.pow(aCos, 2));
    phi = Math.atan(aSin / aCos);
    result = {
        x: harmonicNumber,
        y: a,
        aSin,
        aCos,
        phi
    };
    return result;
}

function getSinTable(amplitude, size) {
    amplitude = amplitude ? amplitude : 1;
    size = size ? size : N;

    let result = [];
    for(let i = 0; i < size; i++) {
        result.push(amplitude * Math.sin(2 * Math.PI * i / size));
    }
    return result;
}

function drawSvgContainer(width, height, margin) {
    svgContainer = d3.select("body").append("svg")
        .attr("width", margin.left + width + margin.right)
        .attr("height", margin.top + height + margin.bottom);
}

function clearSvgContainer(svg) {
    svg.selectAll("*").remove();
}

function drawAxes(xLength, yLength, startPoint, y_scale, x_scale) {
    let ys = y_scale ? y_scale : 1;
    let xs = x_scale ? x_scale : 1;
    let xScale = d3.scaleLinear().domain([0, xLength / xs]).range([0, xLength]);
    let yScale = d3.scaleLinear().domain([-1 * yAxisLength / ys / 2, yAxisLength / ys / 2]).range([yLength, 0]);
    let xAxis = d3.axisBottom().scale(xScale);
    let yAxis = d3.axisLeft().scale(yScale);

    svgContainer
        .append("g")
        .attr('class', 'axis')
        .attr('transform', 'translate(' + startPoint.x + ',' + Math.round(svgMargin.top * 1.75) + ')')
        .call(yAxis);

    svgContainer
        .append("g")
        .attr('class', 'axis')
        .attr('transform', 'translate(' + startPoint.x + ',' + startPoint.y + ')')
        .call(xAxis);
}

function drawFunctionGraph(points, color, width, y_scale, x_scale) {
    debugger;
    for(let i = 0; i < points.length - 1; i++) {
        drawLine(points[i], points[i+1], color, width, y_scale, x_scale);
    }
}

function drawPoints(functionResults, color, size) {
    functionResults.forEach( point => {
        drawPoint(point, color, size);
    });
}

function drawLine(p1, p2, color, width, ys, xs) {
    svgContainer.append("line")
        .attr("x1", p1.x * xs + startPoint.x)
        .attr("y1", startPoint.y - (p1.y * ys))
        .attr("x2", p2.x * xs + startPoint.x)
        .attr("y2", startPoint.y - (p2.y * ys))
        .attr("stroke-width", width || 1)
        .attr("stroke", color || 'black');
}

function drawPoint(point, color, size) {
    svgContainer.append("circle")
        .attr("cx", point.x + startPoint.x)
        .attr("cy", startPoint.y - (point.y * scale))
        .attr("r", size || 1)
        .style("fill", color);
}