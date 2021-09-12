import React, { useState, useEffect } from 'react';
import { getRuns } from './services/services';
import { exportExcel } from './util/excel';
import { makeStyles, TextField, Button } from '@material-ui/core';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import LoadingOverlay from 'react-loading-overlay';
import ReactDOM from 'react-dom';
import sortRowsByProperty from './sortByProperty';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '90vh',
    width: '95vw',
    margin: '0 auto',
    marginBottom: '3em',
    overflow: 'auto',
  },
  toolbar: {
    margin: theme.spacing(2),
    display: 'flex',
    gap: '2em',
  },
}));
function HomePage() {
  const classes = useStyles();
  const hotTableComponent = React.createRef();

  // let ascendingNode = ReactDOM.findDOMNode(<HotTable />).getElementsByClassName('ascending');
  // let descendingNode = ReactDOM.findDOMNode(<HotTable />).getElementsByClassName('descending');

  const [runs, setRuns] = useState({
    runs: [],
  });
  const [filteredRuns, setFilteredRuns] = useState({
    filteredRuns: [],
  });

  const [pooledRuns, setPooledRuns] = useState({
    pooledRuns: [],
  });

  const [sampleIdRuns, setSampleIdRuns] = useState({
    sampleIdRuns: [],
  });

  const [otherSampleIdRuns, setOtherSampleIdRuns] = useState({
    otherSampleIdRuns: [],
  });

  const [recipeRuns, setRecipeRuns] = useState({
    recipeRuns: [],
  });

  const [tumor, setTumorRuns] = useState({
    tumorRuns: [],
  });

  const [poolConcentrationRuns, setPoolConcentrationRuns] = useState({
    poolConcentrationRuns: [],
  });

  const [requestIdRuns, setRequestIdRuns] = useState({
    requestIdRuns: [],
  });

  const [requestNameRuns, setRequestNameRuns] = useState({
    requestNameRuns: [],
  });

  const [altConcentrationRuns, setAltConcentrationRuns] = useState([]);

  const [concentrationUnitsRuns, setConcentrationUnitsRuns] = useState({
    concentrationUnitsRuns: [],
  });

  const [volumeRuns, setVolumeRuns] = useState({
    volumeRuns: [],
  });

  const [plateIdRuns, setPlateIdRuns] = useState({
    plateIdRuns: [],
  });

  const [wellPosRuns, setWellPosRuns] = useState({
    wellPosRuns: [],
  });

  const [barcodeSeqRuns, setBarcodeSeqRuns] = useState({
    barcodeSeqRuns: [],
  });

  const [barcodeIdRuns, setBarcodeIdRuns] = useState({
    barcodeSeqRuns: [],
  });

  const [runTypeRuns, setRunTypeRuns] = useState({
    runTypeRuns: [],
  });

  const [readsRequestedRuns, setReadsRequestedRuns] = useState({
    readsRequestedRuns: [],
  });

  const [readsRemainingRuns, setReadsRemainingRuns] = useState({
    readsRequestedRuns: [],
  });

  const [readsAchievedRuns, setReadsAchievedRuns] = useState({
    readsAchievedRuns: [],
  });
  const [columns, setColumns] = useState({
    columns: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sorting, setSorting] = React.useState(true);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    let searchTerm = event.target.value;
    if (searchTerm == '') return setFilteredRuns(runs);

    var searchResults = [];
    searchResults = runs.filter((el) => {
      return Object.values(el).join().toLowerCase().includes(searchTerm.toLowerCase());
    });
    if (searchResults.length == 0) {
      setSorting(false);
      setFilteredRuns([[]]);
    } else {
      setFilteredRuns(searchResults);
    }
  };

  async function handleRuns() {
    getRuns().then((result) => {
      console.log(result);
      result.rows.map((row) => {
        row.readTotal = parseInt(row.readTotal / 1000000);
        row.remainingReads = parseInt(row.remainingReads / 1000000);
        return row;
      });
      const rowsLen = result.rows.length;
      const checkboxData = [];
      for (let i = 0; i < rowsLen; i++) {
        checkboxData.push({ excluded: true }, { excluded: false });
      }

      const checkboxColumn = { columnHeader: 'Exclude From Planning', data: checkboxData, type: 'checkbox' };
      setRuns(result.rows);
      setFilteredRuns(result.rows);

      setColumns((prev) => [checkboxColumn, ...result.columns]);
      // setColumns(result.columns);

      //function to sort data according to column header/property
      const arr = [...result.rows];
      const sortRowsByProperty = (arr, property, direction) => {
        let res = arr.sort(function (a, b) {
          var A = Object.keys(a)[0];
          var B = Object.keys(b)[0];
          if (direction === 'ascending') {
            return a[A][property] < b[B][property] ? -1 : 1;
          } else if (direction === 'descending') {
            return a[A][property] < b[B][property] ? 1 : -1;
          }
        });
        return res;
      };

      setIsLoading(false);
    });
  }

  useEffect(() => {
    setIsLoading(true);
    handleRuns();
  }, []);

  const handleExport = () => {
    exportExcel(filteredRuns, columns);
    setAltConcentrationRuns(sortRowsByProperty(filteredRuns, 'altConcentration', 'ascending'));
  };

  return (
    <div className={classes.container}>
      <LoadingOverlay active={isLoading} spinner text='Loading...'>
        <div className={classes.toolbar}>
          <TextField id='search' label='Search' variant='outlined' value={searchTerm} onChange={handleChange} />
          <Button id='gridExport' onClick={handleExport} color='primary' variant='contained' type='submit'>
            Export Excel
          </Button>
        </div>

        <HotTable
          ref={hotTableComponent}
          data={filteredRuns}
          search='true'
          colHeaders={columns ? Object.keys(columns).map((el) => columns[el].columnHeader) : ''}
          columns={columns}
          filters='true'
          columnSorting={sorting}
          manualColumnResize={true}
          licenseKey='non-commercial-and-evaluation'
          rowHeaders={true}
          stretchH='all'
          height='700'
        />
      </LoadingOverlay>
    </div>
  );
}

export default HomePage;
