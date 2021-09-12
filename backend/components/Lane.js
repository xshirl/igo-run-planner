const ID = require('./uniqueId');

class Lane {
  constructor(type) {
    // this.id = ID(); // identify each lane by a unique id
    this.totalReads = 0; // current number of reads in lane
    this.samples = []; // array of samples to be loaded on a lane
    this.type = type; //this.readCapacity[type] to find range of read capacity, type of flowcell
    this.readCapacity = { SP: [350, 400], S1: [800, 900], S2: [1800, 1900], S4: [2400, 2600] }; // ranges for each type of flowcell
    this.capacity = this.readCapacity[this.type];
  }

  addSample(sample) {
    this.samples.push(sample);
  }

  getTotalReads() {
    for (let sample of this.samples) {
      this.totalReads += parseInt(sample.readsRequested);
    }
  }

  getCapacity() {
    return this.readCapacity[this.type];
  }
}

module.exports = {
  Lane,
};
