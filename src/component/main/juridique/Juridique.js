import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { useEffect, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import Cookie from 'js-cookie';
import { codeToName } from '../../../utilities/Function';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ModalJuridique from './modal/ModalJuridique';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
    juridiqueContainer: {
        marginTop: theme.spacing(2),
    },
    containerTable: {
        maxHeight: '80vh',
    },
    btnAction: {
        display: 'flex',
        justifyContent: 'end',
        '& > *': {
            marginLeft: theme.spacing(2)
        }
    },
    toolbar:{
        display:'flex',
        justifyContent:'space-between',
    }
}))

export default function Juridique(props) {
    const classes = useStyles();
    const [baseSelected, setBaseSelected] = useState('lot')
    const [data, setData] = useState([])
    const [updateData, setupdateData] = useState({})
    const [openModal, setOpenModal] = useState(false)

    const handleChangeBaseSelected = (v) => {
        setData([])
        setBaseSelected(v)
    }

    const handleOpenModal = (openning, row) => {
        openning ? setupdateData(row) : setupdateData({});
        setOpenModal(openning)
    }

    const handleChangeUpdateData = (e) => {
        setupdateData({ ...updateData, [e.target.name]: e.target.value })
    }

    const handleValideUpdateData = () => {
        axios({
            method: 'put',
            url: 'global/createOrUpdate',
            data: { ...updateData, table: baseSelected },
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => {
            if (response.status === 200) {
                let newArrayData = [...data]
                if (updateData.id === '') { // Create
                    newArrayData.push({ ...updateData, id: response.data.insertId })
                } else { // Update
                    newArrayData = newArrayData.map((v) => v.id === updateData.id ? { ...updateData } : v)
                }
                setData(newArrayData);
                handleOpenModal(false)
            }
        })
    }

    const handleDelete = () => {
        axios({
            method: 'put',
            url: 'global/delete',
            data: { ...updateData, table: baseSelected },
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => {
            if (response.status === 200) {
                let newArrayData = data.filter((v) => v.id !== updateData.id)
                setData(newArrayData);
                handleOpenModal(false)
            }
        })
    }

    useEffect(() => {
        axios({
            method: 'GET',
            url: 'global/findAll?table=' + baseSelected,
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => setData(response.data))
    }, [baseSelected])

    return (<>


        <Paper className={classes.juridiqueContainer}>

            <Toolbar className={`${classes.toolbar} primary-color-gradient`}>
                <div>Base de données</div>
                <div className={classes.btnAction} >
                    <FormControl size="small" variant="outlined">
                        {/* <FormControlLabel>Choisir une base</FormControlLabel> */}
                        <InputLabel id="demo-simple-select-outlined-label">BDD</InputLabel>
                        <Select
                            name='BDD'
                            value={baseSelected}
                            // onChange={(e) => props.handleChangeSelect(props.column.key, e.target.value)}
                            onChange={(e) => handleChangeBaseSelected(e.target.value)}
                            label='BDD' >

                            {['lot', 'attributaire', 'niveau', 'objectif', 'dispositif', 'ape', 'commune'].map((v) => (
                                <MenuItem key={v} value={v} >
                                    {v.charAt(0).toUpperCase() + v.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button disabled={data.length === 0} variant="contained" color="primary" onClick={
                        () => handleOpenModal(true,
                            () => { let Obj = { ...data[0] }; for (let k in Obj) Obj[k] = ''; return Obj; })}>Ajouter : {codeToName(baseSelected)}</Button>
                </div>
            </Toolbar>

            <TableContainer component={Paper} className={`${classes.containerTable} scrollBar-personnalize`}>
                <Table size="small" className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Action</TableCell>
                            {data.length > 0 && Object.keys(data[0]).map((v) => (
                                <TableCell key={v} value={v} >
                                    {codeToName(v)}
                                </TableCell>
                            ))}
                        </TableRow >
                    </TableHead >
                    <TableBody>
                        {data.length > 0 && data.map((row, i) => (
                            <TableRow key={'row_' + i}>
                                <TableCell>
                                    <IconButton key={'iconRow_' + i} aria-label="Editer" color="primary" onClick={() => handleOpenModal(true, row)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                                {Object.keys(data[0]).map((v, i) => (
                                    <TableCell key={row[v] + i} value={row[v] + i} >
                                        {row[v]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table >
            </TableContainer >
        </Paper >

        <ModalJuridique
            baseSelected={baseSelected}
            openModal={openModal}
            updateData={updateData}
            handleDelete={handleDelete}
            handleChangeUpdateData={handleChangeUpdateData}
            handleOpenModal={handleOpenModal}
            handleValideUpdateData={handleValideUpdateData}
        />


    </>)
}