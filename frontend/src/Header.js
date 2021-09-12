import React from 'react';
import { Button, Avatar, AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';

import logo from './logo.png';

function Header() {
  const classes = useStyles();

  return (
    <AppBar position='static' title={logo} className={classes.header}>
      <Toolbar className={classes.toolbar} >
        <Avatar alt='mskcc logo' src={logo} className={classes.avatar} />

        <Typography color='inherit' variant='h6' className={classes.title}>
          IGO Run Planner
          
        </Typography>
        <Button href="/planRuns" className={classes.button}>Plan Runs</Button>
      </Toolbar>
    </AppBar>
  );
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRight: theme.spacing(3),
  },
  header: {
    backgroundColor: theme.palette.primary.logo,
    color: 'white',
    textAlign: 'center'
  },
  title: {
    marginRight: theme.spacing(3),
  },
  button : {
    marginLeft: '100px',
    color: '#007CBA',
    backgroundColor: 'white',
    padding: '10px',
    display:'flex!important',
    justifyContent: 'flex-end!important',
    alignItems: 'flex-end!important'
  },
  toolbar: {
    display: 'flex'
  }
}));

export default Header;
