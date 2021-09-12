const { Run } = require('./Run');
const { Project } = require('./Project');
const { Sample } = require('./Sample');
const { Lane } = require('./Lane.js');
const { isValidRun } = require('./barcodeCollisions.js');

function getTotalReads(projects) {
  return projects.reduce((acc, el) => acc + el.totalReads, 0);
}

function difference(projects, sumArr) {
  // removes projects in sumArr from projects
  projects.sort((a, b) => b.totalReads - a.totalReads);
  sumArr.sort((a, b) => b.totalReads - a.totalReads);

  for (let i = 0; i < projects.length; i++) {
    for (let j = 0; j < sumArr.length; j++) {
      if (projects[i].totalReads == sumArr[j].totalReads) {
        projects.splice(i, 1);
      }
    }
  }
  return projects;
}

function optimizeLanes(projects) {
  const flowcells = {
    S4: [2400, 2600, 200],
    S2: [1800, 1900, 100],
    S1: [800, 900, 100],
    SP: [350, 400, 50],
  };

  let result = [['Remaining']];
  let sortedProjects = projects;
  sortedProjects.sort((a, b) => {
    // sort projects in descending order by total reads
    let A = a.totalReads;
    let B = b.totalReads;
    return A < B ? 1 : A > B ? -1 : 0;
  });

  let temp = [];

  let remaining;
  let gap;
  let laneNum;

  totalReads = getTotalReads(sortedProjects); //get total reads

  while (totalReads > 0) {
    for (let key in flowcells) {
      if (totalReads >= flowcells[key][0] && totalReads <= flowcells[key][1]) {
        // if total reads fits in flowcell, push to Runs
        result.push([key]);
        for (let project of sortedProjects) {
          result[result.length - 1].push(project); // push project to list
        }
        sortedProjects = [];
        break;
      }
    }

    if (totalReads < 700) {
      // if total reads don't fit in any flow cell, push projects to remaining
      for (let project of sortedProjects) {
        result[0].push(project);
      }
      sortedProjects = [];
      break;
    }
    if (sortedProjects.length > 0) {
      for (let key in flowcells) {
        if (totalReads >= flowcells[key][1]) {
          // if totalReads is greater than flowcell capacity, set capacity, range, laneNum to flowcell properties
          result.push([key]);
          remaining = flowcells[key][1];
          gap = flowcells[key][2];
          break;
        }
      }
      for (let i = 0; i < sortedProjects.length; i++) {
        if (remaining - sortedProjects[i].totalReads > 0) {
          // if remaining is greater than 0, check if no barcode collisions and append project to run
          let runSamples = [];

          for (let project of result[result.length - 1].slice(1)) {
            for (let sample of project.samples) {
              runSamples.push(sample);
            }
          }
          //   console.log('valid run samples', [...runSamples, ...sortedProjects[i].samples]);
          if (isValidRun([...runSamples, ...sortedProjects[i].samples], 1)) {
            result[result.length - 1].push(sortedProjects[i]);
            remaining -= sortedProjects[i].totalReads;
          }
        } else if (remaining - projects[i].totalReads == 0) {
          // if equal to zero, remove project from sortedProjects
          let runSamples = [];
          for (let project of result[result.length - 1].slice(1)) {
            for (let sample of project.samples) {
              runSamples.push(sample);
            }
          }

          if (isValidRun([...runSamples, ...sortedProjects[i].samples], laneNum)) {
            result[result.length - 1].push(sortedProjects[i]);
            remaining -= sortedProjects[i].totalReads;
            sortedProjects = difference(sortedProjects, result[result.length - 1].slice(1));
            console.log('sortedProjects');
          }
        } else {
          if (i == 0) {
            result[0].push(sortedProjects[i]);
            sortedProjects.splice(0, 1);

            break;
          } else {
            continue;
          }
        }
      }

      if (remaining != 0 && remaining <= gap) {
        let lastRun = result[result.length - 1];
        sortedProjects = difference(sortedProjects, lastRun);
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
      } else if (remaining > gap) {
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
            // // }
            // temp = difference(temp, removed);
            // temp.push(result[result.length - 1][result[result.length - 1].length - 1]);
            sortedProjects = difference(sortedProjects, [
              result[result.length - 1][result[result.length - 1].length - 1],
            ]);
            result.pop();
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

  let output = { Runs: [], Lanes: [], Remaining: [] };

  for (let project of result[0].slice(1)) {
    output['Remaining'].push(project);
  }

  let lanes = result.slice(1);
  let types = lanes.map((type) => type[0]);
  console.log('types', types);
  let laneProjects = lanes.map((project) => project.slice(1));
  console.log('lane', laneProjects);
  for (let i = 0; i < types.length; i++) {
    let laneObj = new Lane(types[i]);
    for (let project of laneProjects[i]) {
      for (let sample of project.samples) {
        laneObj.samples.push(sample);
      }
    }
    laneObj.getTotalReads();
    output['Lanes'].push(laneObj);
  }

  return output;
}

// let sample1 = new Sample('1', 'Pool', 'ACTAGC', 'A', 'a', '123', 200, 'PE100', 'ABC', 120, 'nM');
// let sample2 = new Sample('2', 'Pool', 'ACTAGC-GCTACD', 'A', '123', 'a', 200, 'PE100', 500, 'ABC', 120, 'nM');
// let sample3 = new Sample('3', 'Pool', 'ACTAGT', 'A', '123', 'PE100', 200, 'ABC', 120, 'nM');
// let sample4 = new Sample('4', 'Pool', 'ACTAGT-ACTTCA', 'A', '123', 'PE100', 200, 'ABC', 120, 'nM');
// let sample5 = new Sample('5', 'Pool', 'ACTAGG', 'A', '123', 'PE100', 200, 'ABC', 120, 'nM');
// let sample6 = new Sample('6', 'Pool', 'ACTAGG', 'A', '123', 'PE100', 200, 'ABC', 120, 'nM');

// let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'sWGS');
// let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'WholeGenome');
// let project3 = new Project('09259_H', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'DNAExtraction');
// let project4 = new Project('06302_AK', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib');

// project1.samples = [sample1, sample2];
// project2.samples = [sample3, sample4];
// project3.samples = [sample5];
// project4.samples = [sample6];
// project1.getProjectReads();
// project2.getProjectReads();
// project3.getProjectReads();
// project4.getProjectReads();

let sample1 = new Sample('1', 'Pool', 'ACTAGC', 'A', 'a', '123', 450, 'PE100', 'ABC', 120, 'nM');
let sample2 = new Sample('2', 'Pool', 'ACTAGC-GCTACD', 'A', '123', 'a', 350, 'PE100', 500, 'ABC', 120, 'nM');
let sample3 = new Sample('3', 'Pool', 'ACTAGT', 'A', '123', 'PE100', 200, 'ABC', 120, 'nM');
let sample4 = new Sample('4', 'Pool', 'ACTAGT-ACTTCA', 'A', '123', 'PE100', 200, 'ABC', 120, 'nM');
let sample5 = new Sample('5', 'Pool', 'ACTAGG', 'A', '123', 'PE100', 200, 'ABC', 120, 'nM');
let sample6 = new Sample('6', 'Pool', 'ACTAGG', 'A', '123', 'PE100', 200, 'ABC', 120, 'nM');

let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'sWGS');
let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'WholeGenome');
let project3 = new Project('09259_H', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'DNAExtraction');
let project4 = new Project('06302_AK', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib');

project1.samples = [sample1, sample2];
project2.samples = [sample3, sample4];

project1.getProjectReads();
project2.getProjectReads();
project3.getProjectReads();
project4.getProjectReads();

for (let lane of optimizeLanes([project1, project2])['Lanes']) {
  for (let sample of lane.samples) {
    console.log('result', lane, sample);
  }
}

console.log(optimizeLanes([project1, project2]));

module.exports = {
  optimizeLanes,
};
