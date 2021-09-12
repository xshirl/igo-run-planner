const { combinationSum } = require('./comboSum.js');
const { Run } = require('./Run');
const { Project } = require('./Project');
const { Sample } = require('./Sample');
const { Lane } = require('./Lane.js');
const { isValidRun } = require('./barcodeCollisions.js');

/**
 * find all flowcells that the projects can fit in, and return runs and projects that don't fit
 * @param  {Array} projects  input array of projects
 * @param  {String} runLength input run length of projects
 * @return {Object}  return object with runs array in runs, remaining array in remaining
 */

// pseudocode:
// 1. using combination sum function, find the optimal combination(greatest reads that fit within a flowcell capacity)
// 2. call combination sum on all 4 run types, from largest to smallest.
// 3. if there are combinations in any run, assign the projects to a run
// 4. Remove projects that have already been accounted for from the original array using removeItems function.
// 5. Call combination sum on remaining projects in array
// 6. If there are no combinations left, end while loop.
// 7. Return result with runs in runs array and remaining projects go in leftover array.

// let removeItems = function (arr, indexes) {
//   //arr is entire array, indexes is array of projects that have been assigned runs already
//   let j = 0;
//   let result = [];
//   for (let i = 0; i < arr.length; i++) {
//     if (j < indexes.length && i == indexes[j]) {
//       j++;
//     } else {
//       result.push(arr[i]); // return array with non-accounted for projects
//     }
//   }
//   return result;
// };

// function determineFlowCells(projects, runLength) {
//   let result = { Runs: [], Lanes: [], Remaining: [] }; // result
//   const runs = {
//     SP: [800, 100, 400, 50],
//     S1: [1800, 200, 900, 100],
//     S2: [3800, 200, 1900, 100],
//     S4: [10000, 1000, 2600, 200],
//   }; //max capacity, range (max- min capacity of flow cell)
//   let priority = ['S4', 'S2', 'S1', 'SP'];
//   priority.forEach((p) => {
//     let target = runs[p][0];
//     let range = runs[p][1];
//     let allocations = combinationSum(projects, target, range); //find optimal combination that fit within run capacity
//     // returns the indices and not the value
//     while (allocations.length > 0) {
//       let runObj = new Run(p, runLength);
//       runObj.projects = allocations.map((index) => projects[index]); // assign run's projects attribute to projects that add up to run capacity
//       runObj.addTotalReads();
//       result['Runs'].push(runObj); // push the run
//       projects = removeItems(projects, allocations); // remove accounted for projects from projects array
//       allocations = combinationSum(projects, target, range); //call combination sum on remaining projects
//     }
//   });
//   priority.forEach((p) => {
//     let target = runs[p][2];
//     let range = runs[p][3];
//     let allocations = combinationSum(projects, target, range);
//     while (allocations.length > 0) {
//       let laneObj = new Lane(p);
//       laneObj.projects = allocations.map((index) => projects[index]);
//       laneObj.getTotalReads();
//       result['Lanes'].push(laneObj);
//       projects = removeItems(projects, allocations);
//       allocations = combinationSum(projects, target, range);
//     }
//   });

//   result['Remaining'] = projects;
//   for (let run of result['Runs']) {
//     run.addTotalReads();
//   }
//   //if there are no further combinations left for any flowcell, return remaining projects in array in "remaining" array

//   result['Remaining'] = projects;
//   return result;
// }

let removeItems = function (projects, rem) {
  let residual = [];
  for (let project of projects) {
    if (rem.includes(project)) continue;
    residual.push(project);
  }
  return residual;
};

const solveRuns = function (projects, runLength) {
  let result = { Runs: [], Lanes: [], Remaining: [] }; // result
  const runs = {
    SP: [800, 100, 400, 50, 2],
    S1: [1800, 200, 900, 100, 2],
    S2: [3800, 200, 1900, 100, 2],
    S4: [10000, 1000, 2600, 200, 4],
  }; //max capacity, range (max- min capacity of flow cell)
  let priority = ['S4', 'S2', 'S1', 'SP']; // flowcells ordered according to priority of use
  projects.sort((a, b) => b.totalReads - a.totalReads); // sort projects according to descending order
  let keep_running = true; // if keep running is true, execute while loop
  let i = 0; // index of run in priority
  while (keep_running) {
    let selected_run = priority[i]; // current run
    let remaining_capacity = runs[selected_run][0]; // capacity of a run
    let min_capacity = remaining_capacity - runs[selected_run][1];
    let num_of_lanes = runs[selected_run][4]; // number of lanes/same barcode sequences allowed
    let selected_projects = []; // projects that add up to capacity of run
    let selected_samples = []; // samples that belong in a project
    let selected_capacity = 0; // current capacity
    for (let project of projects) {
      if (project.totalReads > remaining_capacity) continue; // if project total reads is greater than capacity, skip
      if (isValidRun([...selected_samples, ...project.samples], num_of_lanes)) {
        remaining_capacity -= project.totalReads; // subtract project reads from weight capacity
        selected_capacity += project.totalReads; // add project reads to current capacity
        selected_projects.push(project); // push project to used projects array
        selected_samples.concat(project.samples); // add project samples to accounted ofr samples array
        if (remaining_capacity > runs[selected_run][1]) {
          selected_projects.pop();
        }
      }
    }
    if (selected_capacity >= min_capacity) {
      let runObj = new Run(priority[i], runLength);
      runObj.projects = selected_projects; // assign run's projects attribute to projects that add up to run capacity
      runObj.addTotalReads();
      result['Runs'].push(runObj); // push the run
      projects = removeItems(projects, selected_projects);
    } else {
      i += 1;
      if (i >= priority.length) keep_running = false; // go through all the runs in runs array and see whether there are projects that fit within array
    }
  }
  result['Remaining'] = projects; // put remaining projects in remaining array in result
  return result;
};

const solveLanes = function (samples) {
  let result = { Runs: [], Lanes: [], Remaining: [] }; // result
  const runs = {
    SP: [800, 100, 400, 50, 2],
    S1: [1800, 200, 900, 100, 2],
    S2: [3800, 200, 1900, 100, 2],
    S4: [10000, 1000, 2600, 200, 4],
  }; //max capacity, range (max- min capacity of flow cell)
  let priority = ['S4', 'S2', 'S1', 'SP'];
  samples.sort((a, b) => b.readsRequested - a.readsRequested);
  let keep_running = true;
  let priority_index = 0;
  while (keep_running) {
    let selected_run = priority[priority_index];
    let remaining_capacity = runs[selected_run][2];
    let min_capacity = remaining_capacity - runs[selected_run][3];
    let num_of_lanes = 1;
    // let selected_projects = [];
    let selected_samples = [];
    let selected_capacity = 0;

    for (let sample of samples) {
      if (sample.readsRequested > remaining_capacity) continue;
      if (isValidRun(samples, num_of_lanes)) {
        remaining_capacity -= sample.readsRequested;
        selected_capacity += sample.readsRequested;
        selected_samples.push(sample);
      }
    }

    if (selected_capacity >= min_capacity) {
      let laneObj = new Lane(priority[priority_index]);
      laneObj.samples = selected_samples; // assign run's projects attribute to projects that add up to run capacity
      laneObj.getTotalReads();
      result['Lanes'].push(laneObj); // push the run
      samples = removeItems(samples, selected_samples);
    } else {
      priority_index += 1;
      if (priority_index >= priority.length) keep_running = false;
    }
  }
  result['Remaining'] = samples;
  return result;
};

// let sample1 = new Sample('', '', 'ACTAGC', 'A', '123', 'PE100', 200, 'ABC', 'ABC', 120, 'nM');
// let sample2 = new Sample('', '', 'ACTAGC-GCTACD', 'A', '123', 'PE100', 400, 'ABC', 'ABC', 120, 'nM');
// let sample3 = new Sample('', '', 'ACTAGT', 'A', '123', 'PE100', 200, 'ABC', 'ABC', 120, 'nM');
// let sample4 = new Sample('POOLEDNORMAL', '', 'ACTAGT-ACTTCA', 'A', '123', 'PE100', 200, 'ABC', 'ABC', 120, 'nM');
// let sample5 = new Sample('', 'Pool', 'ACTAGG', 'A', '123', 'PE100', 400, 'ABC', 'ABC', 120, 'nM');
// let sample6 = new Sample('', 'Pool', 'ACTAGG', 'A', '123', 'PE100', 200, 'ABC', 'ABC', 120, 'nM');

// console.log(solveLanes([sample1, sample2, sample3]));

let sample1 = new Sample('', '', 'ACTAGC', 'A', '123', 'PE100', 500, 'ABC', 'ABC', 120, 'nM');
let sample2 = new Sample('', '', 'ACTAGC-GCTACD', 'A', '123', 'PE100', 500, 'ABC', 'ABC', 120, 'nM');
let sample3 = new Sample('', '', 'ACTAGT', 'A', '123', 'PE100', 300, 'ABC', 'ABC', 120, 'nM');
let sample4 = new Sample('POOLEDNORMAL', '', 'ACTAGT-ACTTCA', 'A', '123', 'PE100', 250, 'ABC', 'ABC', 120, 'nM');
let sample5 = new Sample('', 'Pool', 'ACTAGG', 'A', '123', 'PE100', 400, 'ABC', 'ABC', 120, 'nM');
let sample6 = new Sample('', 'Pool', 'ACTAGG', 'A', '123', 'PE100', 300, 'ABC', 'ABC', 120, 'nM');

let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'sWGS');
let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'WholeGenome');
let project3 = new Project('09259_H', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'DNAExtraction');
let project4 = new Project('06302_AK', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib');
let project5 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib');

project1.samples = [sample1, sample2];
project2.samples = [sample3, sample4];
project3.samples = [sample5];
project4.samples = [sample6];
project1.getProjectReads();
project2.getProjectReads();
project3.getProjectReads();
project4.getProjectReads();
console.log(solveRuns([project1, project2, project3, project4], 'PE100'));

function getTotalReads(projects) {
  let total = 0;
  for (let project of projects) {
    total += project.totalReads;
  }
  return total;
}

function binPlanner(projects, runLength) {
  let result = { Runs: [], Lanes: [], Remaining: [] }; // result
  const flowcells = {
    S4: [9000, 10000, 1000, 4],
    S2: [3600, 3800, 200, 2],
    S1: [1600, 1800, 200, 2],
    SP: [700, 800, 100, 2],
  };
  // sort projects according to descending order
  let projectsCopy = JSON.parse(JSON.stringify(projects));
  projectsCopy.sort((a, b) => b.totalReads - a.totalReads);

  let samples = [];
  for (let project of projects) {
    for (let sample of project.samples) {
      samples.push(sample);
    }
  }

  let totalReads = getTotalReads(projects);

  while (totalReads > 0) {
    for (let key in flowcells) {
      if (
        totalReads >= flowcells[key][0] &&
        totalReads <= flowcells[key][1] &&
        isValidRun(samples, flowcells[key][3])
      ) {
        let runObj = new Run(key, runLength);
        runObj.projects = projects;
        runObj.addTotalReads();
        result['Runs'].push(runObj);
      }
    }

    if (totalReads < 700) {
      result['Remaining'].push(samples);
    }

    let remaining = 0;
    let gap = 0;
    let laneNum = 0;
    let runProjects = [];
    if (projectsCopy.length > 0) {
      for (let key in flowcells) {
        if (totalReads > flowcells[key][1]) {
          let runObj = new Run(key, runLength);
          // result["Runs"].push(runObj);
          remaining = flowcells[key][1]; // capacity of run
          gap = flowcells[key][2]; // range
          laneNum = flowcells[key][3]; // number of lanes
        }
      }
      for (let i = 0; i < projectsCopy.length; i++) {
        // let temp = JSON.parse(JSON.stringify(runProjects));
        if (remaining - projectsCopy[i].totalReads > 0) {
          if (isValidRun([...runProjects, projectsCopy[i]])) runProjects.push(projectsCopy[i]);
          remaining - projectsCopy[i].totalReads;
        } else if (remaining - projectsCopy[i].totalReads == 0) {
          runProjects.push(projectsCopy[i]);
          remaining - projectsCopy[i].totalReads;
          projectsCopy.splice(i, 1);
          break;
        } else {
          if (projectsCopy[i] == projectsCopy[0]) {
            result['Remaining'].push(projectsCopy[i]);
            projectsCopy.splice(i, 1);
            break;
          } else {
            continue;
          }
        }
      }

      if (remaining != 0 && remaining <= gap) {
        for (let i = 0; i < projectsCopy.length; i++) {
          if (runProjects.includes(projectsCopy[i])) {
            projectsCopy.splice(i, 1);
          }
        }
      }
    }
  }
}

module.exports = {
  // determineFlowCells,
  solveRuns,
  solveLanes,
};
