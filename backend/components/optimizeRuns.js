function getTotalReads(projects) {
  return projects.reduce((acc, el) => acc + el, 0);
}
const flowcells = {
  S4: [9000, 10000, 1000, 4],
  S2: [3600, 3800, 200, 2],
  S1: [1600, 1800, 200, 2],
  SP: [700, 800, 100, 2],
};

function difference(projects, sumArr) {
  // removes projects in sumArr from projects
  projects.sort((a, b) => b - a);
  sumArr.sort((a, b) => b - a);

  for (let i = 0; i < projects.length; i++) {
    for (let j = 0; j < sumArr.length; j++) {
      if (projects[i] == sumArr[j]) {
        projects.splice(i, 1);
      }
    }
  }
  return projects;
}

function optimizeRuns(projects) {
  let result = [['Remaining']];
  let sortedProjects = JSON.parse(JSON.stringify(projects));
  sortedProjects.sort((a, b) => b - a);
  let totalReads = getTotalReads(sortedProjects);

  let temp = [];

  let remaining;
  let gap;
  let laneNum;

  totalReads = getTotalReads(sortedProjects);

  totalReads = getTotalReads(sortedProjects);

  while (totalReads > 0) {
    for (let key in flowcells) {
      if (totalReads >= flowcells[key][0] && totalReads <= flowcells[key][1]) {
        result.push([key]);
        for (let project of sortedProjects) {
          result[result.length - 1].push(project);
        }
        sortedProjects = [];
        break;
      }
    }

    if (totalReads < 700) {
      for (let project of sortedProjects) {
        result[0].push(project);
      }
      sortedProjects = [];
    }

    if (sortedProjects.length > 0) {
      for (let key in flowcells) {
        if (totalReads >= flowcells[key][1]) {
          result.push([key]);
          remaining = flowcells[key][1];
          gap = flowcells[key][2];
          laneNum = flowcells[key][3];
          break;
        }
      }
      //   console.log('run', result);
      for (let i = 0; i < sortedProjects.length; i++) {
        if (remaining - sortedProjects[i] > 0) {
          //   let temp_test = JSON.parse(JSON.stringify(result[result.length - 1]));
          //   temp_test.push(sortedProjects[i]);
          result[result.length - 1].push(sortedProjects[i]);
          remaining -= sortedProjects[i];
        } else if (remaining - projects[i] == 0) {
          //   let temp_test = JSON.parse(JSON.stringify(result[result.length - 1]));
          //   temp_test.push(sortedProjects[i]);
          result[result.length - 1].push(sortedProjects[i]);
          remaining -= sortedProjects[i];
          sortedProjects = difference(sortedProjects, result[result.length - 1]);
          //   console.log('sorted1', sortedProjects);

          //   if(temp.length >0) {
          //       sortedProjects = sortedProjects.concat(temp);
          //       sortedProjects.sort((a,b) => b-a);
          //   }
          break;
        } else {
          if (i == 0) {
            // totalReads -= sortedProjects[i];
            result[0].push(sortedProjects[i]);
            sortedProjects.splice(0, 1);

            break;
          } else {
            continue;
          }
        }
      }

      if (remaining != 0 && remaining <= gap) {
        // console.log(result[result.length - 1]);
        let lastRun = result[result.length - 1];
        sortedProjects = difference(sortedProjects, lastRun);
        // console.log('filtered', sortedProjects);
        // for (let i = 0; i < lastRun.length; i++) {
        //   if (sortedProjects.includes(lastRun[i])) {
        //     sortedProjects = difference(sortedProjects, lastRun);
        //     console.log('sorted', sortedProjects);
        //   }
        // }
        // if(temp.length > 0) {
        //
        // }
      }
      if (remaining == flowcells[result[result.length - 1][0][1]]) {
        result.pop();
      }
      //   else if (result[result.length - 1].length == 1) {
      //     result.pop();
      //   }
      else if (remaining > gap) {
        if (result[result.length - 1].length == 2) {
          result[0].push(result[result.length - 1][1]);
          sortedProjects = difference(sortedProjects, result[result.length - 1]);
          result.pop();
        } else {
          if (temp.length > 0) {
            let removed = [];
            for (let k = 0; k < temp.length; k++) {
              if (result[result.length - 1][result[result.length - 1].length - 1] > temp[k]) {
                sortedProjects.push(temp[k]);
                removed.push(temp[k]);
              }
            }
            // for (let m = 0; m < removed.length; m++) {
            //   for (let n = 0; n < temp.length; n++) {
            //     if (temp[n] == removed[m]) {
            //       temp.splice(n, 1);
            //     }
            //   }
            // }
            temp = difference(temp, removed);
            temp.push(result[result.length - 1][result[result.length - 1].length - 1]);
            sortedProjects = difference(sortedProjects, [
              result[result.length - 1][result[result.length - 1].length - 1],
            ]);
            // result.pop();
          } else {
            temp.push(result[result.length - 1][result[result.length - 1].length - 1]);
            sortedProjects = difference(sortedProjects, [
              result[result.length - 1][result[result.length - 1].length - 1],
            ]);
            result.pop();
          }
        }
      }
    }
    totalReads = getTotalReads(sortedProjects);
  }

  return result;
}

// console.log(optimizeRuns([1800]));
// console.log(optimizeRuns([1000, 700]));
// console.log(optimizeRuns([600, 200]));
// console.log('result', optimizeRuns([1000, 800, 450, 400, 300]));
console.log('result', optimizeRuns([2000, 400, 300]));
// console.log('result', optimizeRuns([1000, 900, 800]));
// console.log('result', optimizeRuns([1000, 900, 500, 300]));
// console.log('result', optimizeRuns([400, 400, 400, 400, 400]));
// console.log('result', optimizeRuns([550, 400, 310, 300]));
console.log('result', optimizeRuns([1000, 550, 400, 300]));
