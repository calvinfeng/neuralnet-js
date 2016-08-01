"use strict";
const DataParser = require('./data-parser.js');
const parser = new DataParser('./iris.json');

/*
  For this project, I will be using functional programming because this
  is largely mathematical. We don't need to store states, so there isn't
  really a need for creating an object/class.
*/

function matMultiply(mat, vec) {
  // mat: n x m and vec: m x 1, result is n x 1
  let result = [];
  for (let rowIdx = 0; rowIdx < mat.length; rowIdx++) {
    let dotProduct = 0;
    for (let i = 0; i < mat[rowIdx].length; i++ ) {
      dotProduct += mat[rowIdx][i]*vec[i];
    }
    result.push(dotProduct);
  }
  return result;
}


function matTranspose(mat) {
  let transpose = [];
  let rowSize = mat.length, colSize = mat[0].length;
  for (let j = 0; j < colSize; j++) {
    let col = [];
    for (let i = 0; i < rowSize; i++) {
      col.push(mat[i][j]);
    }
    transpose.push(col);
  }
  return transpose;
}

// This is also called dotTimes
function eleProduct(vec1, vec2) {
  let result = [];
  for (let i = 0; i < vec1.length; i++) {
    result.push(vec1[i]*vec2[i]);
  }
  return result;
}

// vec1 - vec2
function vecSubstract(vec1, vec2) {
  let result = [];
  for (let i = 0; i < vec1.length; i++) {
    result.push(vec1[i] - vec2[i]);
  }
  return result;
}

function ones(length) {
  let onesVec = [];
  for (let i = 0; i < length; i++) {
    onesVec.push(1);
  }
  return onesVec;
}

/*
This will randomly initialize a matrix (row by col) with elements' values
ranging from -epsilon to epsilon
*/
function randomInit(rowSize, colSize, e) {
  let mat = [];
  for (let i = 0; i < rowSize; i++) {
    let row = [];
    for (let j = 0; j < colSize; j++) {
      row.push(Math.random()*(2*e) - e);
    }
    mat.push(row);
  }
  return mat;
}

function zeroMat(rowSize, colSize) {
  let mat = [];
  for (let i = 0; i < rowSize; i++) {
    let row = [];
    for (let j = 0; j < colSize; j++) {
      row.push(0);
    }
    mat.push(row);
  }
  return mat;
}

// string formatting for matrix
function printMat(mat) {
  for (let i = 0; i < mat.length; i++) {
    let string = "";
    for (let j = 0; j < mat[i].length; j++) {
      if (mat[i][j] >= 0) {
        string += " " + mat[i][j].toFixed(3) + " ";
      } else {
        string += mat[i][j].toFixed(3) + " ";
      }
    }
    console.log(string);
  }
}

function sigmoid(zVector) {
  let sigVector = [];
  for (let i = 0; i < zVector.length; i++) {
    sigVector.push(1/(1 + Math.exp(-1 * zVector[i])));
  }
  return sigVector;
}

function forwardProp(xVec) {
  // Initialize z and put input vector into collection of activationVectors
  let z, aVecs = [xVec];
  for (let i = 0; i < weights.length; i++) {
    z = matMultiply(weights[i], [0].concat(aVecs[i]));
    aVecs.push(sigmoid(z));
  }
  // a has 3 vector, a[0] represents input layer, a[1] represents hidden layer, and a[2] is output
  return aVecs;
}

function backProp(aVecs, yVec) {
  // aVecs : Activiation vectors
  let L = aVecs.length - 1;
  let deltaVecs = [vecSubstract(aVecs[L], yVec)];
  for (let i = L - 1; i >= 0; i--) {
    let wT = matTranspose(weights[i]);
    let a = [1].concat(aVecs[i]);
    let gPrime = eleProduct(a, vecSubstract(ones(a.length), a));
    let delta = eleProduct(matMultiply(wT, deltaVecs[0]), gPrime);
    deltaVecs.unshift(delta);
  }
  return deltaVecs;
}

function accumDelta(bigDeltas, deltas, aVecs) {
// Iterate through layers, denote l as layer.
// Work on mapping from output layer to last hidden layer first.
  let L = bigDeltas.length - 1;
  
  for (let i = 0; i < deltas[L + 1].length; i++) {
    let a = [1].concat(aVecs[L]);
    for (let j = 0; j < a.length; j++) {
      bigDeltas[L][i][j] += deltas[L + 1][i]*a[j];
    }
  }

  for (let l = L - 1; l >= 0; l--) {
    let delta = deltas[l + 1].slice(1);
    for (let i = 0; i < delta.length; i++) {
      let a = [1].concat(aVecs[l]);
      for (let j = 0; j < a.length; j++) {
        bigDeltas[l][i][j] += delta[i]*a[j];
      }
    }
  }
}

function computePartial(trainingSetX, trainingSetY) {
  let m = trainingSetX.length;
  let bigDeltas = [zeroMat(4, 5), zeroMat(3, 5)];
  for (let i = 0; i < 5; i++) {
    let activations = forwardProp(trainingSetX[i]);
    let deltas = backProp(activations, trainingSetY[i]);
    accumDelta(bigDeltas, deltas, activations);
    console.log("Layer 1");
    printMat(bigDeltas[0]);
    console.log("Layer 2");
    printMat(bigDeltas[1]);
  }
  return bigDeltas;
}



/*
  For this iris classification problem, I will use 3 layers of neural network
  for simplicity.
  Layer 1 is the input layer, with 4 units + 1 bias.
  Layer 2 is the hidden layer, once again, 4 units  + 1 bias.
  Layer 3 is the output layer, with 3 units, no bias
*/

// These are the weights for layer 1 and layer 2. Layer 3 does not have weights.
const weights = [randomInit(4, 5, 0.1), randomInit(3, 5, 0.1)];
const xVec = parser.xVector;
const yVec = parser.yVector;
computePartial(xVec, yVec);
