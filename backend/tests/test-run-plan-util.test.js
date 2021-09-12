const assert = require('assert');
const expect = require('chai').expect;

const { planRuns } = require('../components/run-plan-util');

describe('result of run planning algorithm', () => {
  it('should return SP and S1', () => {
    expect(planRuns([1000, 400, 800, 450, 300])).to.eql([['S1', [1000, 800], 'SP', [450, 300]], [400]]);
  });

  it('should return SP', () => {
    expect(planRuns([2000, 400, 350])).to.eql([['SP', [400, 350]], [2000]]);
  });
  it('should return S1 and SP', () => {
    expect(planRuns([1000, 400, 800, 550, 300])).to.eql([['S1', [1000, 800], 'SP', [400, 300]], [550]]);
  });

  it('should return SP', () => {
    expect(planRuns([550, 400, 310, 300])).to.eql([
      ['SP', [400, 310]],
      [550, 300],
    ]);
  });
  it('should return S1', () => {
    expect(planRuns([1000, 900, 500, 300])).to.eql([['S1', [1000, 500, 300]], [900]]);
  });
  it('should return remaining array of 500, 100', () => {
    expect(planRuns([500, 100])).to.eql([[], [500, 100]]);
  });
  it('should return SP', () => {
    expect(planRuns([2000, 400, 350])).to.eql([['SP', [400, 350]], [2000]]);
  });
  it('should return S1', () => {
    expect(planRuns([400, 400, 400, 400, 400])).to.eql([['S1', [400, 400, 400, 400]], [400]]);
  });
  it('should return S1', () => {
    expect(planRuns([800, 800])).to.eql([['S1', [800, 800]], []]);
  });
});
