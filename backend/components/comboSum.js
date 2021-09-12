const { Project } = require('./Project');

/**
 * using dp top-down approach, find all combinations that sum up to the target within the range (max - min read capacity)
 * @param  {Array} arr  input array of projects
 * @param  {Number} target  target sum
 * @param  {Number} range  range that sum needs to be within of target
 * @return {Array}  return array of indices that correspond to reads that fit run
 */

function sumArrReads(projects) {
  // sum up the reads in a project
  return projects.reduce((acc, el) => {
    return acc + el.totalReads;
  }, 0);
}

let INF = 1000000000;

var combinationSum = function (arr, target, range, numLanes) {
  let minCapacity = target - range;
  if (sumArrReads(arr) < minCapacity) {
    return []; // return empty array if sum of reads in array is less than min capacity
  }
  let sel = new Array(arr.length);
  let dp = new Array(arr.length);
  for (let i = 0; i <= target; i++) {
    sel[i] = new Array(target + 1).fill(0);
    dp[i] = new Array(target + 1).fill(-1); //memoization
  }

  function rec(arr, index, remainingCapacity) {
    //recursive function
    if (remainingCapacity < 0) {
      return INF;
    } else if (index >= arr.length) {
      var usedCapacity = target - remainingCapacity;
      return usedCapacity < minCapacity ? INF : remainingCapacity;
    } else if (dp[index][remainingCapacity] != -1) {
      return dp[index][remainingCapacity];
    }
    let a = rec(arr, index + 1, remainingCapacity); // do not select the element
    let b = rec(arr, index + 1, remainingCapacity - arr[index].totalReads); // do select the element
    let minValue = INF;
    if (a < b) {
      sel[index][remainingCapacity] = false;
      minValue = a;
    } else {
      sel[index][remainingCapacity] = true;
      minValue = b;
    }
    dp[index][remainingCapacity] = minValue;
    return minValue;
  }

  let selectedCapacity = target - rec(arr, 0, target);
  if (selectedCapacity < minCapacity || selectedCapacity > target) {
    return [];
  }

  let result = [];
  let current = target;
  for (let index = 0; index < arr.length; index++) {
    if (sel[index][current]) {
      result.push(index);
      current -= arr[index].totalReads;
    }
  }
  return result;
};

module.exports = {
  combinationSum,
};
