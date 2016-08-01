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
  // Initialize z and put input vector into a
  let z, a = [xVec];
  for (let i = 0; i < weights.length; i++) {
    z = matMultiply(weights[i], [0].concat(a[i]));
    a.push(sigmoid(z));
  }
  // a has 3 vector, a[0] represents input layer, a[1] represents hidden layer, and a[2] is output
  return a;
}

function backProp(yVec) {
  
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
printMat(forwardProp(xVec[0]));
