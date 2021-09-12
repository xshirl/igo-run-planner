const apiResponse = require('../helpers/apiResponse');
// const { authenticateRequest } = require('../middlewares/jwt-cookie');
const { getRuns } = require('../services/services');
const { logger } = require('../helpers/winston');
const { mainRunPlanner } = require('../components/mainPlanner');
const fs = require('fs');

let raw = fs.readFileSync('./samples.json');
let data = JSON.parse(raw);
const columns = [
  { columnHeader: 'Run Id', data: 'id', editor: false },
  { columnHeader: 'Run Type', data: 'type', editor: false },
  { columnHeader: 'Run Length', data: 'runType', editor: false },
  { columnHeader: 'Pool', data: 'pool', editor: false },
  { columnHeader: 'Sample ID', data: 'sampleId', editor: false },
  { columnHeader: 'Recipe', data: 'recipe', editor: false },
  { columnHeader: 'Request ID', data: 'requestId', editor: false },
  { columnHeader: 'Request Name', data: 'requestName', editor: false },
  //   { columnHeader: 'Sample Conc.', data: 'altConcentration', editor: false, type: 'numeric' },
  //   { columnHeader: 'Units', data: 'concentrationUnits', editor: false },
  { columnHeader: 'Barcode Sequence', data: 'barcodeSeq', editor: false },
  { columnHeader: 'Barcode ID', data: 'barcodeId', editor: false },
  {
    columnHeader: 'Reads Requested',
    data: 'readNum',
    editor: false,
    type: 'numeric',
  },
  //   {
  //     columnHeader: 'Reads Remaining',
  //     data: 'remainingReads',
  //     editor: false,
  //     type: 'numeric',
  //   },
  //   {
  //     columnHeader: 'Reads Achieved',
  //     data: 'readTotal',
  //     editor: false,
  //     type: 'numeric',
  //   },
  // { columnHeader: 'Micronic Barcode', data: 'micronicBarcode', editor:false },
];

/**
 * Returns runs
 *
 * @type {*[]}
 */
exports.getRuns = [
  // authenticateRequest,
  function (req, res) {
    logger.log('info', 'Retrieving random quote');
    let key = 'RUNS';
    let retrievalFunction = () => getRuns();
    let lanes = [];

    getRuns()
      .then((result) => {
        let grid = generateGrid(result.data);
        let data = JSON.stringify(grid);

        return apiResponse.successResponseWithData(res, 'success', {
          rows: grid,
          columns: columns,
        });
      })
      .catch((err) => {
        return apiResponse.ErrorResponse(res, err.message);
      });
  },
];

// UTIL
generateGrid = (data) => {
  data.forEach((element) => {
    try {
      element.altConcentration = element.altConcentration.toFixed(2);
      element.concentration = concentration.toFixed(3);
    } catch (error) {
      return;
    }
  });
  return data;
};

exports.getPooledRuns = [
  // authenticateRequest,
  function (req, res) {
    logger.log('info', 'Retrieving random quote');
    let key = 'RUNS';
    let retrievalFunction = () => getRuns();
    let lanes = [];

    getRuns()
      .then((result) => {
        let pooledData = [];
        // let resultRuns = mainRunPlanner(generateGrid(result.data))['Runs'];
        let resultRuns = mainRunPlanner(generateGrid(data))['Runs'];
        let id = 0;
        for (let run of resultRuns) {
          id += 1;
          for (let project of run.projects) {
            for (let sample of project.samples) {
              let sampleObj = {};
              sampleObj['id'] = id;
              sampleObj['type'] = run.type;
              sampleObj['sampleId'] = sample.sampleId;
              sampleObj['pool'] = sample.pool;
              sampleObj['barcodeSeq'] = sample.barcodeSeq;
              sampleObj['barcodeId'] = sample.barcodeId;
              sampleObj['recipe'] = sample.recipe;
              sampleObj['runType'] = sample.runLength;
              sampleObj['readNum'] = sample.readsRequested;
              sampleObj['requestName'] = sample.requestName;
              sampleObj['requestId'] = sample.requestId;
              // sampleObj['altConcentration'] = sample.sampleConcentration;
              // sampleObj['concentrationUnits'] = sample.concentrationUnits;
              pooledData.push(sampleObj);
            }
          }
        }
        // console.log('pooledData', pooledData);
        return apiResponse.successResponseWithData(res, 'success', {
          rows: pooledData,
          columns: columns,
        });
      })
      .catch((err) => {
        return apiResponse.ErrorResponse(res, err.message);
      });
  },
];
