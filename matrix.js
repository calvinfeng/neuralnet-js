"use strict";

const Matrix = {

  norm: function(mat) {
    let sum = 0;
    for (let i = 0; i < mat.length; i++) {
      for (let j = 0; j < mat[i].length; j++) {
        sum += mat[i][j]*mat[i][j];
      }
    }
    return sum;
  },

  multiply: function(mat, vec) {
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
  },

  transpose: function(mat) {
    let tMat = [];
    let rowSize = mat.length, colSize = mat[0].length;
    for (let j = 0; j < colSize; j++) {
      let col = [];
      for (let i = 0; i < rowSize; i++) {
        col.push(mat[i][j]);
      }
      tMat.push(col);
    }
    return tMat;
  },

  //Initialize a matrix (row by col) with random ele values ranging from -e to e
  random: function(rowSize, colSize, e) {
    let mat = [];
    for (let i = 0; i < rowSize; i++) {
      let row = [];
      for (let j = 0; j < colSize; j++) {
        row.push(Math.random()*(2*e) - e);
      }
      mat.push(row);
    }
    return mat;
  },

  zeros: function(rowSize, colSize) {
    let mat = [];
    for (let i = 0; i < rowSize; i++) {
      let row = [];
      for (let j = 0; j < colSize; j++) {
        row.push(0);
      }
      mat.push(row);
    }
    return mat;
  },

  print: function(mat) {
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
  },

  dup: function(mat) {
    let copy = [];
    for (let i = 0; i < mat.length; i++) {
      let row = [];
      for (let j = 0; j < mat[i].length; j++) {
        row.push(mat[i][j]);
      }
      copy.push(row);
    }
    return copy;
  }

};

module.exports = Matrix;
