"use strict";

const speciesMap = {
  'Iris-setosa': [1, 0, 0],
  'Iris-versicolor': [0, 1, 0],
  'Iris-virginica': [0, 0, 1]
};

class DataParser {
  constructor(fileName) {
    this.dataFile = require(fileName);
    this.xVector = this.getXVector();
    this.yVector = this.getYVector();
  }

  getXVector() {
    let xVectors = [], data = this.dataFile;
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
  }

  getYVector() {
    let yVector = [], data = this.dataFile;
    for (let i = 0; i < data.length; i++) {
      yVector.push(speciesMap[data[i].Species]);
    }
    return yVector;
  }
}

module.exports = DataParser;
