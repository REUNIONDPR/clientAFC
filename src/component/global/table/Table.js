import React, { useEffect, useState } from 'react';
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
import Row from './Row';
import './table.css';

export default function CollapsibleTable(props) {

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
  const [creatingRow, setCreatingRow] = useState(false);
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

  // ------------ Toggle show column
  const [columns, SetColumns] = useState(props.columns);
  const [checkColumnsVisible, SetCheckColumnsVisible] = useState([]);
  const [checkAll, setCheckAll] = useState(true);

  useEffect(() => {
    let col = props.columns.filter((col) => { if (col !== 'id') { return col; } else { return false; } });
    SetColumns(col);
    SetCheckColumnsVisible(col);
  }, [props.columns])

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
  const [filter, setFilter] = useState({})

  useEffect(() => {
    props.filter.map((v) => setFilter({ ...filter, [v.varName]: v.valueSelected }))
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [props.filter])

  const handleChangeFilter = (key, value) => {
    setFilter({ ...filter, [key]: value })
    props.handleChangeFilter(value)
  }

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
        // handleChangeFilter={props.handleChangeFilter} 
        handleChangeFilter={handleChangeFilter}
        user={props.user}
        handleCreateRow={handleCreateRow}
        handleToggle={handleToggle}
        handleCheckAll={handleCheckAll} checkAll={checkAll}
        columns={columns}
        checkColumnsVisible={checkColumnsVisible}
        btnAddAction={props.handleOpenModal}
      />

      <TableContainer>
        <Table aria-label="collapsible table" size="small">
          <TableHead>
            <TableRow>
              {/* <TableCell style={{ position: 'relative' }}>
              </TableCell> */}
              {columns.map((col) => (
                checkColumnsVisible.indexOf(col) !== -1 &&
                <TableCell align="center" className='nowrap' key={col}>{col.includes('display_') ? codeToName(col.split('display_')[1]) : codeToName(col)}</TableCell>
              ))}
              <TableCell align="center" className='nowrap' key='actionT'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {creatingRow && (<Row key="newRow" row={''} handleExitEditClick={() => { setCreatingRow(false) }} />)}
            {/* Si plusieur lignes ? */}
            {/* {Array.isArray(displayRows)
              ? displayRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => <Row key={row.id + '_' + index} row={row} editingRow={editingRow}
                  checkColumnsVisible={checkColumnsVisible}
                  // handleEditClick={() => { setEditingRow(row.id) }}
                  handleEditClick={props.handleOpenModal}
                  handleExitEditClick={handleExitEditClick}
                  handleEditSubmitClick={handleEditSubmitClick}
                  editing={editingRow}
                  user={props.user} />)
              : <Row key={displayRows.id} row={displayRows} editingRow={editingRow}
                checkColumnsVisible={checkColumnsVisible}
                // handleEditClick={() => { setEditingRow(displayRows.id) }}
                handleEditClick={props.handleOpenModal}
                handleExitEditClick={handleExitEditClick}
                handleEditSubmitClick={handleEditSubmitClick}
                editing={editingRow}
                user={props.user} />
            } */}
            {Object.entries(filter).map(([k, v]) => (
              v !== 'none'
                ? displayRows.filter((r) => r[k] === v)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    <Row key={row.id + '_' + index} row={row} editingRow={editingRow}
                      checkColumnsVisible={checkColumnsVisible}
                      // handleEditClick={() => { setEditingRow(row.id) }}
                      handleEditClick={props.handleOpenModal}
                      handleExitEditClick={handleExitEditClick}
                      handleEditSubmitClick={handleEditSubmitClick}
                      editing={editingRow}
                      user={props.user} />
                  )
                : displayRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    <Row key={row.id + '_' + index} row={row} editingRow={editingRow}
                      checkColumnsVisible={checkColumnsVisible}
                      // handleEditClick={() => { setEditingRow(row.id) }}
                      handleEditClick={props.handleOpenModal}
                      handleExitEditClick={handleExitEditClick}
                      handleEditSubmitClick={handleEditSubmitClick}
                      editing={editingRow}
                      user={props.user} />
                  )
            ))}


          </TableBody>
        </Table>
      </TableContainer>
      {Object.entries(filter).map(([k, v]) => (
        v !== 'none'
          ? displayRows.filter((r) => r[k] === v).length > rowsPerPage &&
            <TablePagination
              rowsPerPageOptions={[10, 30, 100]}
              component="div"
              count={displayRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          : displayRows.length > rowsPerPage &&
            <TablePagination
              rowsPerPageOptions={[10, 30, 100]}
              component="div"
              count={displayRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
      ))}

    </Paper>
  );
}
