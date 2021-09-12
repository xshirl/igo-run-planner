/**
 * groupUserLibraries groups user libraries according to project (requestId) and puts them in runs/lanes
 * @param  {Array} projects array of project objects
 * @return {Array} returns array of run objects
 */

const { Run } = require('./Run');
const { Sample } = require('./Sample');
const { Project } = require('./Project');
const { optimizeRuns } = require('./optimizeRuns2');

function groupUserLibraries(projects) {
  let result = { Runs: [], Lanes: [], rem: [] };
  let capacities = { SP: [700, 800], S1: [1600, 1800], S2: [3600, 3800], S4: [9000, 10000] };
  let totalReads = 0;
  let map = {};
  let runLengths = [];
  let rem;
  for (let project of projects) {
    runLengths.push(project.runLength);
  }
  let runLengthSet = new Set(runLengths);
  runLengthSet.forEach((runLength) => {
    map[runLength] = [];
  });
  for (let project of projects) {
    map[project.runLength].push(project);
  }
  for (let [runLength, project] of Object.entries(map)) {
    let runs = optimizeRuns(project, runLength)['Runs'];
    for (let run of runs) {
      result['Runs'].push(run);
      run.addTotalReads();
    }
    rem = optimizeRuns(project, runLength)['Remaining'];
  }
  if (Array.isArray(rem)) {
    for (let project of rem) {
      let runLength = project.runLength;
      if (totalReads <= capacities['SP'][0]) {
        let run = new Run('SP', runLength);
        run.addProject(project);
        run.addTotalReads();
        result['Runs'].push(run);
      }
    }
  }

  // let res = { Runs: [], rem: [] };
  // for (let project of projects) {
  //   if (project.isUserLibrary) {
  //     if (project.totalReads <= capacities['SP'][0]) {
  //       let run = new Run('SP', project.runLength);
  //       run.totalReads += project.totalReads;
  //       run.projects.push(project);
  //       res['Runs'].push(run);
  //     } else if (project.totalReads >= capacities['S1'][0] && project.totalReads <= capacities['S1'][1]) {
  //       let run = new Run('S1', project.runLength);
  //       run.totalReads += project.totalReads;
  //       run.projects.push(project);
  //       res['Runs'].push(run);
  //     } else if (project.totalReads >= capacities['S2'][0] && project.totalReads <= capacities['S2'][1]) {
  //       let run = new Run('S2', project.runLength);
  //       run.totalReads += project.totalReads;
  //       run.projects.push(project);
  //       res['Runs'].push(run);
  //     } else if (project.totalReads >= capacities['S4'][0] && project.totalReads <= capacities['S4'][1]) {
  //       let run = new Run('S4', project.runLength);
  //       run.totalReads += project.totalReads;
  //       run.projects.push(project);
  //       res['Runs'].push(run);
  //     }
  //   } else {
  //     res['rem'].push(project);
  //   }
  // }
  return result;
}

// let sample1 = new Sample(1, '', 'ACTAGC', '123', 'PE100', 800, 'ABC', 'ABC', 120, 'nM');
// let sample2 = new Sample(2, '', 'ACTAGC-GCTACD', '123', 'PE100', 800, 'ABC', 'ABC', 120, 'nM');
// let sample3 = new Sample(3, '', 'ACTAGT', '123', 'PE100', 50, 'ABC', 'ABC', 120, 'nM');
// let sample4 = new Sample(4, '', 'ACTAGT-ACTTCA', '123', 'PE100', 800, 'ABC', 'ABC', 120, 'nM');
// let sample5 = new Sample(5, 'Pool', 'ACTAGG', '123', 'PE100', 800, 'ABC', 'ABC', 120, 'nM');
// let sample6 = new Sample(6, 'Pool', 'ACTAGG', '123', 'PE100', 50, 'ABC', 'ABC', 120, 'nM');
// let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'Investigator ');
// let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'Investigator');
// let project3 = new Project('00921', 'PE100', [], 'WholeGenome', 'WholeGenome');
// project1.samples = [sample1, sample2];
// project2.samples = [sample4, sample5];
// project3.samples = [sample3, sample6];
// project1.getProjectReads();
// project2.getProjectReads();
// project3.getProjectReads();

// console.log(groupUserLibraries([project1, project2, project3]));
// for (let run of groupUserLibraries([project1, project2, project3])['Runs']) {
//   // console.log(run);
//   for (let project of run.projects) {
//     // console.log(project);
//   }
// }
module.exports = {
  groupUserLibraries,
};
