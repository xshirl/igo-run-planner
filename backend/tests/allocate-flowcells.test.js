const assert = require('assert');
const expect = require('chai').expect;

const { Sample } = require('../components/Sample');
const { Project } = require('../components/Project');
const { Lane } = require('../components/Lane');
const { Run } = require('../components/Run');
const { optimizeRuns } = require('../components/optimizeRuns2');

describe('should return S1 and SP', () => {
  let sample1 = new Sample('a', 'Pool', 'ACTAGC', 'A', 'a', '123', 500, 'PE100', 'ABC', 120, 'nM');
  let sample2 = new Sample('a', 'Pool', 'ACTAGC-GCTACD', 'A', '123', 'a', 500, 'PE100', 500, 'ABC', 120, 'nM');
  let sample3 = new Sample('a', 'Pool', 'ACTAGT', 'A', '123', 'PE100', 300, 'ABC', 120, 'nM');
  let sample4 = new Sample('z', 'Pool', 'ACTAGT-ACTTCA', 'A', '123', 'PE100', 500, 'ABC', 120, 'nM');
  let sample5 = new Sample('a', 'Pool', 'ACTAGG', 'A', '123', 'PE100', 400, 'ABC', 120, 'nM');
  let sample6 = new Sample('a', 'Pool', 'ACTAGG', 'A', '123', 'PE100', 300, 'ABC', 120, 'nM');

  let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'sWGS');
  let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'WholeGenome');
  let project3 = new Project('09259_H', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'DNAExtraction');
  let project4 = new Project('06302_AK', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib');

  project1.samples = [sample1, sample2];
  project2.samples = [sample3, sample4];
  project3.samples = [sample5];
  project4.samples = [sample6];
  project1.getProjectReads();
  project2.getProjectReads();
  project3.getProjectReads();
  project4.getProjectReads();

  let run = new Run('S1', 'PE100');
  run.addProject(project1);
  run.addProject(project2);
  run.addTotalReads();

  let run2 = new Run('SP', 'PE100');
  run2.addProject(project3);
  run2.addProject(project4);
  run2.addTotalReads();

  it('returns sp and s1 runs', () => {
    expect(optimizeRuns([project1, project2, project3, project4], 'PE100')['Runs']).to.eql([run, run2]);
  });
});

describe('should return S1 (1000, 500, 300)', () => {
  let sample1 = new Sample('a', 'Pool', 'ACTAGC', 'A', 'a', '123', 1000, 'PE100', 'ABC', 120, 'nM');
  let sample2 = new Sample('a', 'Pool', 'ACTAGC-GCTACD', 'A', '123', 'a', 900, 'PE100', 500, 'ABC', 120, 'nM');
  let sample3 = new Sample('a', 'Pool', 'ACTAGT', 'A', '123', 'PE100', 300, 'ABC', 120, 'nM');
  let sample4 = new Sample('a', 'Pool', 'ACTAGT', 'A', '123', 'PE100', 500, 'ABC', 120, 'nM');

  let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'sWGS');
  let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'WholeGenome');
  let project3 = new Project('09259_H', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'DNAExtraction');
  let project4 = new Project('06302_AK', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib');

  project1.samples = [sample1];
  project2.samples = [sample2];
  project3.samples = [sample3];
  project4.samples = [sample4];
  project1.getProjectReads();
  project2.getProjectReads();
  project3.getProjectReads();
  project4.getProjectReads();

  let run = new Run('S1', 'PE100');
  run.addProject(project1);
  run.addProject(project4);
  run.addProject(project3);
  run.addTotalReads();

  it('returns s1 run', () => {
    expect(optimizeRuns([project1, project2, project3, project4], 'PE100')['Runs']).to.eql([run]);
  });
});

describe('should return SP (400, 300)', () => {
  let sample1 = new Sample('a', 'Pool', 'ACTAGC', 'A', 'a', '123', 400, 'PE100', 'ABC', 120, 'nM');
  let sample2 = new Sample('a', 'Pool', 'ACTAGC-GCTACD', 'A', '123', 'a', 300, 'PE100', 500, 'ABC', 120, 'nM');
  let sample3 = new Sample('a', 'Pool', 'ACTAGC-GCTACD', 'A', '123', 'a', 2000, 'PE100', 500, 'ABC', 120, 'nM');

  let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'sWGS');
  let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'WholeGenome');
  let project3 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'WholeGenome');

  project1.samples = [sample1];
  project2.samples = [sample2];
  project3.samples = [sample3];

  project1.getProjectReads();
  project2.getProjectReads();
  project3.getProjectReads();

  let run = new Run('SP', 'PE100');
  run.addProject(project1);
  run.addProject(project2);
  // run.addProject(project3);
  run.addTotalReads();

  it('returns sp run', () => {
    expect(optimizeRuns([project1, project2, project3], 'PE100')['Runs']).to.eql([run]);
  });
});

describe('should return S1 (1000, 400, 300)', () => {
  let sample1 = new Sample('a', 'Pool', 'ACTAGC', 'A', 'a', '123', 400, 'PE100', 'ABC', 120, 'nM');
  let sample2 = new Sample('a', 'Pool', 'ACTAGC-GCTACD', 'A', '123', 'a', 300, 'PE100', 500, 'ABC', 120, 'nM');
  let sample3 = new Sample('a', 'Pool', 'ACTAGC-GCTACD', 'A', '123', 'a', 1000, 'PE100', 500, 'ABC', 120, 'nM');
  let sample4 = new Sample('a', 'Pool', 'ACTAGC-GCTACD', 'A', '123', 'a', 550, 'PE100', 500, 'ABC', 120, 'nM');

  let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'sWGS');
  let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'WholeGenome');
  let project3 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'WholeGenome');

  project1.samples = [sample1];
  project2.samples = [sample2];
  project3.samples = [sample3];

  project1.getProjectReads();
  project2.getProjectReads();
  project3.getProjectReads();

  let run = new Run('S1', 'PE100');
  run.addProject(project3);
  run.addProject(project1);
  run.addProject(project2);
  run.addTotalReads();

  it('returns s1 run', () => {
    expect(optimizeRuns([project1, project2, project3], 'PE100')['Runs']).to.eql([run]);
  });
  it('returns s1 run', () => {
    expect(optimizeRuns([project1, project2, project3], 'PE100')['Remaining']).to.eql([550]);
  });
});
