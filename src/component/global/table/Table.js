import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import { codeToName } from '../../../utilities/Function';
import SnackBar from '../SnackBar/SnackBar';
import ToolbarPersonnalize from './Toolbar';
import Row from '../../main/catalogue/Row';
import './table.css';

const useStyles = makeStyles((theme) => ({
  table: {
    maxHeight: 650,
  },
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
  const [columns, SetColumns] = useState(props.columns);
  const [checkColumnsVisible, SetCheckColumnsVisible] = useState([]);
  const [checkAll, setCheckAll] = useState(true);

  useEffect(() => {
    let col = props.columns.filter((col) => { if (!col.includes('id')) { return col; } else { return false; } });
    SetColumns(col);
    SetCheckColumnsVisible(col);
  }, [props.columns])

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
      SetCheckColumnsVisible(columns)
    }
    setCheckAll(!checkAll)
  }
  // ----------------------------
  return (
    <Paper style={{ maxHeight: '80%', overflow: 'auto', marginBottom: 20 }} >

      <SnackBar
        open={openSnackBar}
        message={messageSnackBar}
        severity={severitySnackBar}
        handleClose={handleCloseSnackBar}
      />

      <ToolbarPersonnalize
        filters={props.filter} propsTableName={propsTableName}
        nbFilter={props.nbFilter}
        handleChangeFilter={props.handleChangeFilter}
        user={props.user}
        handleToggle={handleToggle}
        handleCheckAll={handleCheckAll} checkAll={checkAll}
        columns={columns}
        checkColumnsVisible={checkColumnsVisible}
        btnAddAction={props.handleOpenModal}
      />

      <TableContainer className={`${classes.table} scrollBar-personnalize`}>
        <Table aria-label="collapsible table" size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                checkColumnsVisible.indexOf(col) !== -1 && 
                <TableCell align="center" className='nowrap' key={col}>{col.includes('display_') ? codeToName(col.split('display_')[1]) : codeToName(col)}</TableCell>
              ))}
              <TableCell align="center" className='nowrap' key='actionT'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) =>
                <Row key={row.id + '_' + index} row={row}
                  checkColumnsVisible={checkColumnsVisible}
                  handleEditClick={props.handleOpenModal}
                  user={props.user}
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
