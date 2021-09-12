// http://plvpipetrack1.mskcc.org:8099/pages/viewpage.action?pageId=25595196

class Sample {
  constructor(
    sampleId,
    pool,
    barcodeSeq,
    barcodeId,
    recipe,
    runLength,
    readsRequested,
    requestName,
    requestId,
    sampleConcentration,
    concentrationUnit
  ) {
    this.sampleId = sampleId;
    this.pool = pool;
    this.barcodeSeq = barcodeSeq; // should be an array bc captured pools have arrays of barcode seqs
    this.barcodeId = barcodeId;
    this.recipe = recipe;
    this.runLength = runLength; // read length
    this.readsRequested = readsRequested;
    this.requestName = requestName; //requestName
    this.requestId = requestId; // project
    this.sampleConcentration = sampleConcentration;
    this.concentrationUnit = concentrationUnit;
    this.barcodeCollision = false;
  }

  isPooled() {
    if (this.pool != undefined) {
      if (this.pool.includes('Pool')) {
        return true;
      }
    }
    return false;
  }

  isNormal() {
    if (this.sampleId != undefined && typeof this.sampleId == 'string') {
      if (this.sampleId.includes('POOLEDNORMAL') && this.isPooled()) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
}

module.exports = {
  Sample,
};
