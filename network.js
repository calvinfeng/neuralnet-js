"use strict";
const IrisData = require('./data-parser.js');
const Matrix = require('./matrix.js');
const Vector = require('./vector.js');
const JSONFile = require('jsonfile');

/*
  We have 3 layers of neural network for simplicity.
  Layer 1 is the input layer: 4 input units + 1 bias unit
  Layer 2 is the hidden layer: 4 activation units + 1 bias unit.
  Layer 3 is the output layer: 3 output units
*/
function dupWeight(weights) {
  let copy = [];
  for (let l = 0; l < weights.length; l++) {
    copy.push(Matrix.dup(weights[l]));
  }
  return copy;
}

function sigmoid(zVector) {
  let sigVector = [];
  for (let i = 0; i < zVector.length; i++) {
    sigVector.push(1/(1 + Math.exp(-1 * zVector[i])));
  }
  return sigVector;
}

function forwardProp(inputVector, weights) {
  let z, activations = [inputVector];
  for (let l = 0; l < weights.length; l++) {
    z = Matrix.multiply(weights[l], [1].concat(activations[l]));
    activations.push(sigmoid(z));
  }
  return activations;
}

function backProp(aVectors, yVec, weights) {
  let L = aVectors.length - 1; // aVectors : activiation vectors
  let deltaVectors = [Vector.substract(aVectors[L], yVec)];
  // Construct delta vectors layer by layer, start from last
  for (let l = L - 1; l >= 0; l--) {
    if (l === 0) {
      // Although we don't need deltas[l = 0], I am putting it there as a place holder
      deltaVectors.unshift(Vector.zeros(aVectors[l].length));
    } else {
      let wT = Matrix.transpose(weights[l]);
      let a = [1].concat(aVectors[l]);
      let gPrime = Vector.elementProduct(a, Vector.substract(Vector.ones(a.length), a));
      let delta = Vector.elementProduct(Matrix.multiply(wT, deltaVectors[0]), gPrime);
      deltaVectors.unshift(delta.slice(1)); //discard delta for bias unit
    }
  }
  return deltaVectors;
}

function accumDelta(deltaMats, deltaVectors, aVectors) {
  // Iterate through layers, denote l as layer.
  let L = deltaMats.length - 1;
  // Work on mapping from output layer to last hidden layer first.
  for (let i = 0; i < deltaVectors[L + 1].length; i++) {
    let a = [1].concat(aVectors[L]);
    for (let j = 0; j < a.length; j++) {
      deltaMats[L][i][j] += deltaVectors[L + 1][i]*a[j];
    }
  }
  for (let l = L - 1; l >= 0; l--) {
    let delta = deltaVectors[l + 1];
    for (let i = 0; i < delta.length; i++) {
      let a = [1].concat(aVectors[l]);
      for (let j = 0; j < a.length; j++) {
        deltaMats[l][i][j] += delta[i]*a[j];
      }
    }
  }
}

function deltaMatrices(weights, trainingSetX, trainingSetY) {
  let m = trainingSetX.length;
  let deltaMats = [Matrix.zeros(4, 5), Matrix.zeros(3, 5)];
  for (let i = 0; i < m; i++) {
    let activations = forwardProp(trainingSetX[i], weights);
    let deltaVectors = backProp(activations, trainingSetY[i], weights);
    accumDelta(deltaMats, deltaVectors, activations);
  }
  return deltaMats;
}

function computePartial(weightMats, deltaMats, trainingSize, lambda) {
  let m = trainingSize;
  let partialDerivativeMats = [];
  for (let l = 0; l < weightMats.length; l++) {
    let derivativeMat = [];
    for (let i = 0; i < weightMats[l].length; i++) {
      let row = [];
      for (let j = 0; j < weightMats[l][i].length; j++) {
        if (j === 0) {
          row.push(deltaMats[l][i][j]/m);
        } else {
          row.push((deltaMats[l][i][j]/m) + (lambda*weightMats[l][i][j]));
        }
      }
      derivativeMat.push(row);
    }
    partialDerivativeMats.push(derivativeMat);
  }
  return partialDerivativeMats;
}

function costFunction(trainingSetX, trainingSetY, weights, lambda) {
  let m = trainingSetX.length;
  let costSum = 0, regularizedSum = 0;
  for (let l = 0; l < weights.length; l++) {
    for (let i = 0; i < weights[l].length; i++) {
      let row = weights[l][i];
      for (let j = 0; j < row.length; j++) {
        regularizedSum += row[j]*row[j];
      }
    }
  }
  regularizedSum *= lambda/(2*m);
  for (let i = 0; i < m; i++) {
    let activations = forwardProp(trainingSetX[i], weights);
    let y = trainingSetY[i], h = activations[activations.length - 1];
    for (let k = 0; k < y.length; k++) {
      costSum += y[k]*Math.log(h[k]) + ((1 - y[k])*Math.log(1 - h[k]));
    }
  }
  return regularizedSum - costSum/m;
}

/*
  Return a list of matrix with each element correspnds to the partial derivative
  with respect to theta[i][j]
*/
function approxGradient(trainingSetX, trainingSetY, weights, lambda, e) {
  let approxGrad = [];
  for (let l = 0; l < weights.length; l++) {
    let partialMat = [];
    for (let i = 0; i < weights[l].length; i++) {
      let row = [];
      for (let j = 0; j < weights[l][i].length; j++) {
        let weightsDup1 = dupWeight(weights);
        weightsDup1[l][i][j] += e;
        let weightsDup2 = dupWeight(weights);
        weightsDup2[l][i][j] -= e;
        let approxPartial = (costFunction(trainingSetX, trainingSetY, weightsDup1, lambda) -
        costFunction(trainingSetX, trainingSetY, weightsDup2, lambda))/(2*e);
        row.push(approxPartial);
      }
      partialMat.push(row);
    }
    approxGrad.push(partialMat);
  }
  return approxGrad;
}

function gradientDescent(trainingSetX, trainingSetY) {
  let weights = [Matrix.random(4, 5, 1), Matrix.random(3, 5, 1)];
  let weightRecord = [];
  let m = trainingSetX.length;
  let lambda = 0.005, alpha = 0.01; //lambda is regularized constant, alpha is learning rate
  let bigDelta, parDerivatives;
  let iterationCount = 0;
  do {
    bigDelta = deltaMatrices(weights, trainingSetX, trainingSetY);
    parDerivatives = computePartial(weights, bigDelta, m, lambda);
    for (let l = 0; l < weights.length; l++) {
      for (let i = 0; i < weights[l].length; i++) {
        for (let j = 0; j < weights[l][i].length; j++) {
          weights[l][i][j] = weights[l][i][j] - alpha*parDerivatives[l][i][j];
        }
      }
    }
    console.log(Matrix.norm(parDerivatives[0]) + Matrix.norm(parDerivatives[1]));
    iterationCount += 1;
    if (iterationCount%1000 === 0) {
      weightRecord.push(dupWeight(weights));
    }
  } while (Matrix.norm(parDerivatives[0]) + Matrix.norm(parDerivatives[1]) > 0.0001);
  console.log(`Gradient Descent has converged from ${iterationCount}`);
  writeToFile(weightRecord);
  return weights;
}

function writeToFile(weights) {
  let file = './weights.json';
  let obj = {weights};
  JSONFile.writeFile(file, obj, function (err) {
    console.error(err);
  });
}

let inputs = IrisData.getInputVectors();
let xTraining = inputs[0], xTest = inputs[1];
let outputs = IrisData.getOutputVectors();
let yTraining = outputs[0], yTest = outputs[1];
const params = gradientDescent(xTraining, yTraining);
for (let l = 0; l < params.length; l++) {
  console.log(`Layer ${l + 1}`);
  Matrix.print(params[l]);
}

for (let i = 0; i < yTest.length; i++) {
  let activations = forwardProp(xTest[i], params);
  let predictions = Vector.classify(activations[activations.length - 1]);
  if (Vector.isEqual(predictions, yTest[i])) {
    console.log(`Test ${i + 1}: Passed`);
  } else {
    console.log(`Test ${i + 2}: Failed`);
  }
  console.log(predictions);
  console.log(yTest[i]);
}
// https://api.myjson.com/bins/2xh0z

let weights = [
  [[-0.894, -0.236, -0.947, 1.673, 0.725],
  [-0.389, 0.298, 0.871, -1.320, -0.574],
  [4.335, 1.593, 1.662, -2.848, -3.070],
  [1.017, 0.254, 1.066, -1.937, -0.786]],
  [[-1.677, -2.871, 1.630, 0.918, 2.844],
  [-4.085, 1.729, -1.258, 4.815, -3.034],
  [1.377, 1.129, -0.732, -5.129, -0.692]]
];
// console.log(forwardProp([6, 2, 5, 1.5], weights));

/*
  This is gradient checking, to make sure backpropagation is working as intended
*/
// const weights = [Matrix.random(4, 5, 0.1), Matrix.random(3, 5, 0.1)];
// let bigDeltas = deltaMatrices(weights, xVecs, yVecs);
// let partial = computePartial(weights, bigDeltas, xVecs.length, 0.005);
// let approxPartial = approxGradient(xVecs, yVecs,weights, 0.005, 0.001);
