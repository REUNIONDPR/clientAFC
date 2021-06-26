import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Table from '../../global/table/Table';
import Cookie from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { UserContext } from '../../../context/user.context';

export default function Catalogue(){
    const { user }  = useContext(UserContext);
    const [ columns, setColumns ] = useState([]);
    const [ rowsZ, setRowsZ ] = useState([]);
    const [ rows, setRows ] = useState([]);

    useEffect(() => {
        setColumns(['#', 'intitule', 'prix', 'nArticle', 'objectif', 'niveau']);
    },[])
    
    useEffect(() => {
        axios({
            method:'GET',
            url: '/catalogue/getAll',
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {setRows(response.data)
            Object.entries(response.data).map(([key, value]) => {
                if(key==0){
                    setColumns(Object.keys(value))
                }
            })
        
        });
    },[user])

    return(
        <>  
            
                <h1>Page aze2</h1>
                <Button variant="contained" color="secondary" >Get</Button>
                <Table columns={columns} rows={rows} name='Catalogue'/>
            
        </>
    )
}