"use strict";

const speciesMap = {
  'Iris-setosa': [1, 0, 0],
  'Iris-versicolor': [0, 1, 0],
  'Iris-virginica': [0, 0, 1]
};

const jsonData = require('./iris.json');
const IrisData = {

  getInputVectors: function() {
    //Take out 5 Iris-setosa, 5 Iris-versicolor, 5 Iris-virginica
    let trainingSet = [], testSet = [], data = jsonData;
    for (let i = 0; i < data.length; i++) {
      let keys = Object.keys(data[i]), x = [];
      for (let j = 1; j < keys.length - 1; j++) {
        x.push(data[i][keys[j]]);
      }
      if ( (145 <= i && i < data.length) || (95 <= i && i < 100) || (45 <= i && i < 50) ) {
        testSet.push(x);
      } else {
        trainingSet.push(x);
      }
    }
    return [trainingSet, testSet];
  },

  getOutputVectors: function() {
    let trainingSet = [], testSet = [], data = jsonData;
    for (let i = 0; i < data.length; i++) {
      if ( (145 <= i && i < data.length) || (95 <= i && i < 100) || (45 <= i && i < 50) ) {
        testSet.push(speciesMap[data[i].Species]);
      } else {
        trainingSet.push(speciesMap[data[i].Species]);
      }
    }
    return [trainingSet, testSet];
  },

  getXVectors: function() {
    let xVectors = [], data = jsonData;
    for (let i = 0; i < data.length; i++) {
      let keys = Object.keys(data[i]), x = [];
      // We don't want ID, and we don't want the class name
      for (let j = 1; j < keys.length - 1; j++) {
        x.push(data[i][keys[j]]);
      }
      xVectors.push(x);
    }
    // 150 by 4
    return xVectors;
  },

  getYVectors: function() {
    let yVector = [], data = jsonData;
    for (let i = 0; i < data.length; i++) {
      yVector.push(speciesMap[data[i].Species]);
    }
    return yVector;
  }

};

module.exports = IrisData;
