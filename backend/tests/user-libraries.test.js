const expect = require('chai').expect;

const { Sample } = require('../components/Sample');
const { Project } = require('../components/Project');
const { Lane } = require('../components/Lane');
const { Run } = require('../components/Run');
const { groupUserLibraries } = require('../components/groupUserLibraries');

describe('result of grouping user libraries together', () => {
  let sample1 = new Sample(1, '', 'ACTAGC', 'A', '123', 'PE100', 800, 'ABC', 'ABC', 120, 'nM');
  let sample2 = new Sample(2, '', 'ACTAGC-GCTACD', 'A', '123', 'PE100', 800, 'ABC', 'ABC', 120, 'nM');
  let sample3 = new Sample(3, '', 'ACTAGT', 'A', '123', 'PE100', 50, 'ABC', 'ABC', 120, 'nM');
  let sample4 = new Sample(4, '', 'ACTAGT-ACTTCA', 'A', '123', 'PE100', 800, 'ABC', 'ABC', 120, 'nM');
  let sample5 = new Sample(5, 'Pool', 'ACTAGG', 'A', '123', 'PE100', 800, 'ABC', 'ABC', 120, 'nM');
  let sample6 = new Sample(6, 'Pool', 'ACTAGG', 'A', '123', 'PE100', 50, 'ABC', 'ABC', 120, 'nM');
  let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'Investigator ');
  let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'Investigator');
  let project3 = new Project('00921', 'PE100', [], 'WholeGenome', 'WholeGenome');
  project1.samples = [sample1, sample2];
  project2.samples = [sample4, sample5];
  project3.samples = [sample3, sample6];
  project1.getProjectReads();
  project2.getProjectReads();
  project3.getProjectReads();
  let run1 = new Run('S1', project1.runLength);
  let run2 = new Run('S1', project2.runLength);
  run1.addProject(project1);
  run1.addProject(project3);
  run1.addTotalReads();
  run2.addProject(project2);
  run2.addTotalReads();
  it('returns S1 with user libraries', () => {
    expect(groupUserLibraries([project1, project2, project3])['Runs']).to.eql([run1, run2]);
  });
});
