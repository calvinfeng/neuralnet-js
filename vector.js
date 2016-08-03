"use strict";

const Vector = {

  elementProduct: function(vec1, vec2) {
    let result = [];
    for (let i = 0; i < vec1.length; i++) {
      result.push(vec1[i]*vec2[i]);
    }
    return result;
  },

  substract: function(vec1, vec2) {
    let result = [];
    for (let i = 0; i < vec1.length; i++) {
      result.push(vec1[i] - vec2[i]);
    }
    return result;
  },

  ones: function(length) {
    let onesVec = [];
    for (let i = 0; i < length; i++) {
      onesVec.push(1);
    }
    return onesVec;
  },

  zeros: function(length) {
    let zerosVec = [];
    for (let i = 0; i < length; i++) {
      zerosVec.push(0);
    }
    return zerosVec;
  },

  classify: function(vec) {
    let max = vec[0];
    for (let i = 0; i < vec.length; i++) {
      if (vec[i] > max) {
        max = vec[i];
      }
    }
    let result = [];
    for (let i = 0; i < vec.length; i++) {
      if (vec[i] === max) {
        result.push(1);
      } else {
        result.push(0);
      }
    }
    return result;
  },

  isEqual: function(vec1, vec2) {
    for (let i = 0; i < vec1.length; i++) {
      if (vec1[i] !== vec2[i]) {
        return false;
      }
    }
    return true;
  }
  
};

module.exports = Vector;
