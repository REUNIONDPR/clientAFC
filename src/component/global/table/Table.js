import React, { useState } from 'react';
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
import './table.css';

export default function CollapsibleTable(props) {

  const Row = props.Row;
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

   // ------------ Create Row
  const [ creatingRow, setCreatingRow ] = useState(false);
  const handleCreateRow = () => {
    setCreatingRow(true)
  }

  const handleExitEditClick = () => {
    setEditingRow(false);
  }
   // ------------ SaveEditChange
  const [editingRow, setEditingRow] = useState(false);
  const handleEditSubmitClick = (row) => {
    setEditingRow(false);
    props.handleEditSubmitClick(row)
  }
  
  return (
    <Paper style={{ maxHeight: '80%', overflow: 'auto' }} >

      <SnackBar
        open={openSnackBar}
        message={messageSnackBar}
        severity={severitySnackBar}
        handleClose={handleCloseSnackBar}
      />

      <ToolbarPersonnalize filter={props.filter} propsTableName={propsTableName} handleChangeFilter={props.handleChangeFilter} user={props.user} handleCreateRow={handleCreateRow}/>

      <TableContainer>
        <Table aria-label="collapsible table" size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              {props.columns.filter((col) => { if (col !== 'id') { return col; }else{return false;} }).map((col) => (
                <TableCell align="center" className='nowrap' key={col}>{codeToName(col)}</TableCell>
              ))}
              <TableCell align="center" className='nowrap' key='actionT'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {creatingRow && (<Row key="newRow" row={''} handleExitEditClick={() => {setCreatingRow(false)}} />)}
            {Array.isArray(displayRows) ?
              displayRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => <Row key={row.id} row={row} editingRow={editingRow}
                handleEditClick={() => {setEditingRow(row.id) }}
                handleExitEditClick={handleExitEditClick}
                handleEditSubmitClick={handleEditSubmitClick}
                editing={editingRow}
                user={props.user} />)
                : <Row key={displayRows.id} row={displayRows} editingRow={editingRow}
                handleEditClick={() => {setEditingRow(displayRows.id) }}
                handleExitEditClick={handleExitEditClick}
                handleEditSubmitClick={handleEditSubmitClick}
                editing={editingRow}
                user={props.user} />
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
