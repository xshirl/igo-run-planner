const assert = require('assert');
const expect = require('chai').expect;

const { Sample } = require('../components/Sample');
const { Project } = require('../components/Project');
const { Lane } = require('../components/Lane');
const { Run } = require('../components/Run');
const { optimizeLanes } = require('../components/optimizeLanes');

describe('it should return S1 lane and SP lane', () => {
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

  let lane1 = new Lane('S1');
  lane1.samples = [sample1, sample2];
  lane1.getTotalReads();
  let lane2 = new Lane('SP');
  lane2.samples = [sample3, sample4];
  lane2.getTotalReads();
  it('returns s1 run', () => {
    expect(optimizeLanes([project1, project2])['Lanes']).to.eql([lane1, lane2]);
  });
});
