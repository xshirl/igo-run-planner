let INF = 1000000000;

var combinationSum = function (arr, target, range) {
  let minCapacity = target - range;
  if (sumArrReads(arr) < minCapacity) {
    return [];
  }
  let sel = new Array(arr.length);
  let dp = new Array(arr.length);
  for (let i = 0; i <= target; i++) {
    sel[i] = new Array(target + 1).fill(0);
    dp[i] = new Array(target + 1).fill(-1);
  }

  function rec(arr, index, remainingCapacity) {
    if (remainingCapacity < 0) {
      return INF;
    } else if (index >= arr.length) {
      var usedCapacity = target - remainingCapacity;
      return usedCapacity < minCapacity ? INF : remainingCapacity;
    } else if (dp[index][remainingCapacity] != -1) {
      return dp[index][remainingCapacity];
    }
    let a = rec(arr, index + 1, remainingCapacity); // do not select the element
    let b = rec(arr, index + 1, remainingCapacity - arr[index]); // do select the element
    let minValue = INF;
    if (a < b) {
      sel[index][remainingCapacity] = false;
      // console.log("False", index, remainingCapacity);
      minValue = a;
    } else {
      sel[index][remainingCapacity] = true;
      // console.log("True", index, remainingCapacity);
      minValue = b;
    }
    dp[index][remainingCapacity] = minValue;
    return minValue;
  }

  let selectedCapacity = target - rec(arr, 0, target);
  // console.log("selected", selectedCapacity);
  if (selectedCapacity < minCapacity || selectedCapacity > target) {
    return [];
  }

  // console.log(sel);

  let result = [];
  let current = target;
  for (let index = 0; index < arr.length; index++) {
    // console.log(index, current, sel[index][current], dp[index][current]);
    if (sel[index][current]) {
      result.push(index);
      current -= arr[index];
    }
  }
  // console.log(result);
  return result;
};

function sumArrReads(arr) {
  return arr.reduce((acc, el) => {
    return acc + el;
  }, 0);
}
let removeItems = function (arr, indexes) {
  let j = 0;
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (j < indexes.length && i == indexes[j]) {
      j++;
    } else {
      result.push(arr[i]);
    }
  }
  return result;
};

function planRuns(samples) {
  const runs = { SP: [800, 100], S1: [1800, 200], S2: [3800, 200], S4: [10000, 1000] }; //max capacity, range (max- min capacity of flow cell)
  let res = []; // returns the "run" type and the most optimal max combination
  let priority = ['S4', 'S2', 'S1', 'SP'];
  priority.forEach((p) => {
    let target = runs[p][0];
    let range = runs[p][1];
    let allocations = combinationSum(samples, target, range);
    // returns the indices and not the value
    while (allocations.length > 0) {
      res.push(
        p,
        allocations.map((index, _) => samples[index])
      );
      samples = removeItems(samples, allocations);
      allocations = combinationSum(samples, target, range);
    }
  });

  return [res, samples];
}

module.exports = {
  planRuns,
};
