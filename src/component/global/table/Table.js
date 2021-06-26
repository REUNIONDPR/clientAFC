import React from 'react';
import Box from '@material-ui/core/Box';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination  from '@material-ui/core/TablePagination';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Typography from '@material-ui/core/Typography';
import { codeToName } from '../../../utilities/Function';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar'; 
import Tooltip from '@material-ui/core/Tooltip'; 

import './table.css';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:{
    color: theme.palette.secondary.main,
    backgroundColor: '#c51162',
  },
  title: {
    flex: '1 1 100%',
  },
}));

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);


function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  // Pour ajouter un tableau collapsé il faut ajouter une entrée à l'objet Row
  // nommé history = [{key:value, key2:value2},{...}, ...]

  return (
    <React.Fragment>
      <StyledTableRow >
        <TableCell>
        {row.hasOwnProperty('history') &&
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        }
        </TableCell>
        <TableCell component="th" scope="row" className='nowrap'>
          {row.lot}
        </TableCell>
        <TableCell component="th" scope="row" className='nowrap'>
          {row.n_Article}
        </TableCell>
        <TableCell className='nowrap'>{row.intitule_form_marche}</TableCell>
        <TableCell align="right">{row.nb_heure_ent}</TableCell>
        <TableCell align="right">{row.nb_heure_appui}</TableCell>
        <TableCell align="right">{row.nb_heure_soutien}</TableCell>
        <TableCell align="right">{row.prixTrancheA}</TableCell>
        <TableCell align="right">{row.prixTrancheB}</TableCell>
      </StyledTableRow>
      {row.hasOwnProperty('history') &&
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      }
    </React.Fragment>
  );
}

export default function CollapsibleTable(props) {  

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const classes = useToolbarStyles();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper style={{maxHeight: '80%', overflow: 'auto'}} >
      <Toolbar className={classes.highlight}>
        
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {props.name}
        </Typography>

        {2 > 0 ? (
          <Tooltip title="Fermer">
            <IconButton aria-label="fermer">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filtre">
            <IconButton aria-label="filtre">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}

      </Toolbar>
      <TableContainer>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            {props.columns.filter((col)=>{if(col!='id'){return col;} }).map((col) => (
              <TableCell align="center" className='nowrap' key={col}>{codeToName(col)}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
        
          {props.rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
            <Row key={row.id+'_'+row.n_Article} row={row} />
          ))}
        </TableBody>
      </Table>
     </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={props.rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      </Paper>
  );
}
