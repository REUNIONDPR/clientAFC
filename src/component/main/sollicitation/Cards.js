import CardPersonnalize from './Card';
import Box from '@material-ui/core/Box';
import Cookie from 'js-cookie';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Cards(props) {

    const [ countTotal, SetCountTotal ] = useState(0);
    const [ countWaintingCheck, SetCountWaintingCheck ] = useState(0);
    const [ countWaitingConv, SetCountWaitingConv ] = useState(0);

    useEffect(()=> {
        axios({
            method: 'GET',
            url: `/formation/count?s=0`,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => SetCountTotal(response.data[0].count));
        axios({
            method: 'GET',
            url: `/formation/count?s=1`,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => SetCountWaintingCheck(response.data[0].count));
        axios({
            method: 'GET',
            url: `/formation/count?s=2`,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => SetCountWaitingConv(response.data[0].count));
    }, [])

    return (

        <Box display="flex" justifyContent="space-between" style={{ marginBottom: 20 }}>
            <CardPersonnalize title="Total de formation" number={countTotal} selected={props.selectedCard === 0} handleClick={() => props.handleSelectedCard(0)} />
            <CardPersonnalize title="En attente de validation" number={countWaintingCheck} selected={props.selectedCard === 1} handleClick={() => props.handleSelectedCard(1)} />
            <CardPersonnalize title="En attente de conventionnement" number={countWaitingConv} selected={props.selectedCard === 2} handleClick={() => props.handleSelectedCard(2)} />
        </Box>

    )
}