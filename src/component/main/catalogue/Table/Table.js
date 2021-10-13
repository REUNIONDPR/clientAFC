import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import { codeToName } from '../../../../utilities/Function';
import SnackBar from '../../../global/SnackBar/SnackBar';
import ToolbarPersonnalize from './Toolbar';
import Row from './Row';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import './table.css';

const useStyles = makeStyles((theme) => ({
  table: {
    maxHeight: 680,
    [theme.breakpoints.down(1550)]: {
      maxHeight: '75vh',
    },
  },
  PaperContainerTable: {
    overflow: 'auto',
    marginBottom: 20
  },
  cellHead: {
    borderLeft: '1px solid rgba(224, 224, 224, 1);',
    whiteSpace: 'nowrap',
    padding: theme.spacing(2)
  },
  mwidth: {
    minWidth: 230,
  },
  filter:{
    padding:theme.spacing(2),
    backgroundColor:'#fafafa',
    border: '1px solid rgba(224, 224, 224)',
  }
}))

export default function TablePersonnalize(props) {

  const classes = useStyles();
  const { displayRows } = props;
  const propsTableName = props.propsTableName;
  // ------------ Pagination
  const [page, setPage] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  // ------------ Snackbar
  const openSnackBar = props.openSnackBar;
  const messageSnackBar = props.messageSnackBar;
  const severitySnackBar = props.severity;
  const handleCloseSnackBar = props.handleCloseSnackbar;

  // ------------ Toggle show column

  const [checkColumnsVisible, SetCheckColumnsVisible] = useState(props.columns);
  const [checkAll, setCheckAll] = useState(true);

  // Toggle toolbar
  const handleToggle = (value) => () => {
    const currentIndex = checkColumnsVisible.indexOf(value);
    const newColumn = [...checkColumnsVisible];

    if (currentIndex === -1) {
      newColumn.push(value);
    } else {
      newColumn.splice(currentIndex, 1);
    }

    SetCheckColumnsVisible(newColumn);
  };

  const handleCheckAll = () => {
    if (checkAll) {
      SetCheckColumnsVisible([])
    } else {
      SetCheckColumnsVisible(props.columns)
    }
    setCheckAll(!checkAll)
  }

  // ----------------------------
  return (
    <Paper className={classes.PaperContainerTable} >

      <SnackBar
        open={openSnackBar}
        message={messageSnackBar}
        severity={severitySnackBar}
        handleClose={handleCloseSnackBar}
      />

      <ToolbarPersonnalize
        propsTableName={propsTableName}
        nbFilter={props.nbFilter}
        user={props.user}
        handleCleanFilter={props.handleCleanFilter}
        handleToggle={handleToggle}
        handleCheckAll={handleCheckAll} checkAll={checkAll}
        columns={props.columns}
        checkColumnsVisible={checkColumnsVisible}
        btnAddAction={props.handleOpenModal}
      />
      <div className={classes.filter} >
        {props.filter && Object.values(props.filter).map((filter, key) => (
          <FormControl variant="outlined" size="small" key={key} >
            <InputLabel id="demo-simple-select-outlined-label">{filter.name}</InputLabel>
            <Select
              value={filter.valueSelected[filter.varName] ? filter.valueSelected[filter.varName] : 'none'}
              onChange={(event) => props.handleChangeFilter(filter.varName, event.target.value)}
              label={filter.name}
            >
              <MenuItem value="all">{filter.displayName}</MenuItem>
              {
                filter.data.map((v) => (
                  <MenuItem key={v.value.toString()} value={v.value}>{v.libelle}</MenuItem>
                ))
              }
            </Select>
          </FormControl>))}
      </div>
      <TableContainer className={`${classes.table} scrollBar-personnalize`}>



        <Table aria-label="collapsible table" size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center" className={classes.cellHead} key='actionT'>Action</TableCell>
              {props.columns.map((col) => (
                checkColumnsVisible.indexOf(col) !== -1 &&
                <TableCell align="center"
                  className={`${classes.cellHead} 
                  ${(col === 'of' || col === 'intitule_form_marche' || col === 'intitule_form_base_article') && classes.mwidth}`}
                  key={col}>{codeToName(col)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) =>
                <Row key={row.id + '_' + index} row={row} columns={props.columns}
                  checkColumnsVisible={checkColumnsVisible}
                  handleEditClick={props.handleOpenModal}
                  adresseHabilited={props.adresseHabilited}
                  action={props.action}
                  handleDeleteAdresse={props.handleDeleteAdresse}
                  handleOpenModalAdresse={props.handleOpenModalAdresse}
                />
              )
            }
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 30, 100]}
        component="div"
        count={displayRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />

    </Paper>
  );
}
