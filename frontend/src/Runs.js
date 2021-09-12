import React, { useState, useEffect } from 'react';
import { getPooledRuns, getRemaining, getLanes } from './services/services';
import { exportExcel } from './util/excel';
import { makeStyles, TextField, Button } from '@material-ui/core';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import LoadingOverlay from 'react-loading-overlay';

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
function RunPage() {
  const classes = useStyles();
  const hotTableComponent = React.createRef();
  const [runs, setRuns] = useState({
    runs: [],
  });
  const [filteredRuns, setFilteredRuns] = useState({
    filteredRuns: [],
  });

  const [runColumns, setRunColumns] = useState({
    columns: [],
  });

  const [remColumns, setRemColumns] = useState({
    columns: [],
  });

  const [remSamples, setRemSamples] = useState({
    remSamples: [],
  });

  const [lanes, setLanes] = useState({
    lanes: [],
  });

  const [laneColumns, setLaneColumns] = useState({
    laneColumns: [],
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

  const handleExport = () => {
    exportExcel(filteredRuns, runColumns);
  };
  async function handleRuns() {
    getPooledRuns().then((result) => {
      result.rows.map((row) => {
        row.readTotal = parseInt(row.readTotal / 1000000);
        row.remainingReads = parseInt(row.remainingReads / 1000000);
        return row;
      });

      setRuns(result.rows);
      setFilteredRuns(result.rows);
      setRunColumns(result.columns);

      setIsLoading(false);
    });
  }

  async function handleRemSamples() {
    getRemaining().then((result) => {
      setRemSamples(result.rows);
      setRemColumns(result.columns);
      setIsLoading(false);
    });
  }

  async function handleLanes() {
    getLanes().then((result) => {
      console.log(result);
      setLanes(result.rows);
      setLaneColumns(result.columns);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    setIsLoading(true);
    handleRuns();
    handleRemSamples();
    handleLanes();
  }, []);

  return (
    <div className={classes.container}>
      <LoadingOverlay active={isLoading} spinner text='Loading...'>
        <div className='tableGrid'>
          <div className='table1'>
            <div className='headerTable'>
              <h4>Samples Ready For Run and Lanes</h4>
              <Button className='export' onClick={handleExport} color='primary' variant='contained' type='submit'>
                Export Excel
              </Button>
            </div>
            <HotTable
              ref={hotTableComponent}
              data={filteredRuns}
              search='true'
              colHeaders={runColumns ? Object.keys(runColumns).map((el) => runColumns[el].columnHeader) : ''}
              columns={runColumns}
              filters='true'
              // columnSorting={sorting}
              manualColumnResize={true}
              licenseKey='non-commercial-and-evaluation'
              rowHeaders={true}
              stretchH='all'
              height='300'
            />
          </div>
          {/* <div className='table2'>
            <div className='headerTable'>
              <h4>Samples Ready For Lane</h4>
              <Button className='export' onClick={handleExport} color='primary' variant='contained' type='submit'>
                Export Excel
              </Button>
            </div>
            <HotTable
              ref={hotTableComponent}
              data={lanes}
              search='true'
              colHeaders={runColumns ? Object.keys(runColumns).map((el) => runColumns[el].columnHeader) : ''}
              columns={runColumns}
              filters='true'
              // columnSorting={sorting}
              manualColumnResize={true}
              licenseKey='non-commercial-and-evaluation'
              rowHeaders={true}
              stretchH='all'
              height='300'
            />
          </div> */}
          <div className='table3'>
            <div className='headerTable'>
              <h4>Samples Not Ready Yet</h4>
              <Button className='export' onClick={handleExport} color='primary' variant='contained' type='submit'>
                Export Excel
              </Button>
            </div>
            <HotTable
              ref={hotTableComponent}
              data={remSamples}
              search='true'
              colHeaders={remColumns ? Object.keys(remColumns).map((el) => remColumns[el].columnHeader) : ''}
              columns={remColumns}
              filters='true'
              // columnSorting={sorting}
              manualColumnResize={true}
              licenseKey='non-commercial-and-evaluation'
              rowHeaders={true}
              stretchH='all'
              height='300'
            />
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
}

export default RunPage;
