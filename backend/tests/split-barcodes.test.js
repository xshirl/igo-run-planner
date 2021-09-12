const assert = require('assert');
const expect = require('chai').expect;

const { Sample } = require('../components/Sample');
const { Project } = require('../components/Project');
const { Lane } = require('../components/Lane');
const { Run } = require('../components/Run');
const { splitBarcodes } = require('../components/barcodeCollisions');
const { determineFlowCells } = require('../components/runPlanner');

describe('result of split barcodes function', () => {
  let sample1 = new Sample(1, '', 'ACTAGC', 'A', '123', 'PE150', 200, 'ABC', 'ABC', 120, 'nM');
  let sample2 = new Sample(2, '', 'ACTAGC-GCTACD', 'A', '123', 'PE150', 200, 'ABC', 'ABC', 120, 'nM');
  let sample3 = new Sample(3, '', 'ACTAGT', '123', 'A', 'PE150', 150, 'ABC', 'ABC', 120, 'nM');
  let sample4 = new Sample(4, '', 'ACTAGT-ACTTCA', 'A', '123', 'PE150', 200, 'ABC', 'ABC', 120, 'nM');
  let sample5 = new Sample(5, 'Pool', 'ACTAGG', 'A', '123', 'PE150', 75, 'ABC', 'ABC', 120, 'nM');
  let sample6 = new Sample(6, 'Pool', 'ACTAGG', 'A', '123', 'PE150', 200, 'ABC', 'ABC', 120, 'nM');

  let project1 = new Project('09838', 'PE100', [sample1, sample2, sample3], 'ShallowWGS', 'sWGS', 1000);
  let project2 = new Project(
    '09931',
    'PE100',
    [sample4, sample5, sample6],
    'WholeGenomeSequencing',
    'WholeGenome',
    400
  );
  let project3 = new Project('09259_H', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'DNAExtraction', 800);
  let project4 = new Project('06302_AK', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 450);
  let project5 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 300);
  let projectArray = [project1, project2, project3, project4, project5];

  let run1 = new Run('SP', 'PE150', projectArray);

  it('should return 2 lanes in run result', () => {
    expect(splitBarcodes(run1)['Runs'][0].lanes.length).to.eql(2);
  });
  it('should return sample 1, sample3 in lane 1 of run result', () => {
    expect(splitBarcodes(run1)['Runs'][0].lanes[0].samples).to.eql([sample1, sample3]);
  });
  it('should return sample 2, 4 in lane 2 of run result', () => {
    expect(splitBarcodes(run1)['Runs'][0].lanes[1].samples).to.eql([sample2, sample4]);
  });
  it('should return samples 5 and 6 in remaining array in object result', () => {
    expect(splitBarcodes(run1)['Remaining'].length).to.eql(2);
    expect(splitBarcodes(run1)['Remaining']).to.eql([sample5, sample6]);
  });
});

