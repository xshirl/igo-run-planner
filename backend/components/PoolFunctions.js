//   // #4 Pool samples from same project(request ID) in same run or make minimum pools for a project
//   // all of same project should be on the same run
const fs = require('fs');
const { Project } = require('./Project');
const { Run } = require('./Run');
const { Sample } = require('./Sample');
const { Lane } = require('./Lane');

// #2 requirement, pooling together samples of same read length
// return map with keys equal to read length, and values are arrays of samples with matching read length

function poolSameRunLength(projects) {
  let map = {};
  let runLengths = [];
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
  return map;
}

// #3 Pool samples in user library in its own lane, no mix of user library
// project with IGO or other user library is allowed
//
function poolSameLibrary(samples) {
  let map = {};
  let libraries = [];
  for (let sample of samples) {
    libraries.push(sample.requestName);
  }
  let librariesSet = new Set(libraries);
  librariesSet.forEach((run) => {
    map[run] = [];
  });
  for (let sample of samples) {
    map[sample.requestName].push(sample);
  }
  return map;
}

// #4 Pool samples from same project(request ID) in same run or make minimum pools for a project
// all of same project should be on the same run

function poolSameProject(samples) {
  let map = {};
  let projects = [];
  let projectObjects = [];
  for (let sample of samples) {
    if (sample.recipe != undefined && !sample.recipe.includes('IDT_Exome')) {
      projects.push(sample.requestId); //push all request ids for samples excluding WES
    }
  }
  let projectsSet = new Set(projects);
  projectsSet.forEach((project) => {
    map[project] = []; //key is requestId, value is array of
  });

  for (let sample of samples) {
    if (sample.recipe != undefined && !sample.recipe.includes('IDT_Exome')) {
      map[sample.requestId].push(sample);
    }
  }

  for (let sample of Object.values(map)) {
    let obj = new Project(sample[0].requestId, sample[0].runType, [], sample[0].recipe, sample[0].requestName);
    projectObjects.push(obj);
  }
  for (let sample of samples) {
    for (let obj of projectObjects) {
      if (sample.requestId == obj.requestId) {
        obj.samples.push(
          new Sample(
            sample.sampleId,
            sample.pool,
            sample.barcodeSeq,
            sample.barcodeId,
            sample.recipe,
            sample.runType,
            sample.readNum,
            sample.requestName,
            sample.requestId,
            sample.altConcentration,
            sample.concentrationUnits
          )
        );
      }
    }
  }

  for (let sample of samples) {
    if (sample.recipe != undefined && sample.recipe.includes('IDT_Exome')) {
      let sampleObj = new Sample(
        sample.sampleId,
        sample.pool,
        sample.barcodeSeq,
        sample.barcodeId,
        sample.recipe,
        sample.runType,
        sample.readNum,
        sample.requestName,
        sample.requestId,
        sample.altConcentration,
        sample.concentrationUnits
      );
      let projectObj = new Project(sample.requestId, sample.runType, [sampleObj], sample.recipe, sample.requestName);

      projectObjects.push(projectObj);
    }
  }

  for (let project of projectObjects) {
    project.getProjectReads();
  }
  return projectObjects;
}

module.exports = {
  poolSameRunLength,
  poolSameLibrary,
  poolSameProject,
};
