import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import axios from 'axios';
// import { socket } from '../../../context/socket.context';
import Tab from '../Tab.js';


export default function Sollicitation() {
    const [idgasi, setIdgasi] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [fonction, setFonction] = useState('');
    const [search, setSearch] = useState('');

    const handleTest = (e) => {
        // e.preventDefault();
        // console.log('emit Socket "event"')
        // socket.emit('event', 'Event from Main.js');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/user/test', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ idgasi: idgasi, fonction: fonction, nom: nom, prenom: prenom }),
        })
            .then((response) => console.log(response));

    };

    const handleSubmitGet = (e) => {
        e.preventDefault();

        axios({
            method: 'GET',
            url: `/user/search?d=${search}`,
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        })
            .then((response) => console.log(response.data));

    };



    return (
        <div >
            <Button variant="contained" onClick={handleTest} color="secondary">
                send Socket
            </Button>
            <form onSubmit={handleSubmit}>
                <p>
                    <strong>Post to Server:</strong>
                </p>
                <TextField label="IDGASI" name="IDGASI" type="text"
                    value={idgasi}
                    onChange={e => setIdgasi(e.target.value)} />
                <TextField label="Nom" name="Nom" type="text"
                    value={nom}
                    onChange={e => setNom(e.target.value)} />
                <TextField label="Prenom" name="Prenom" type="text"
                    value={prenom}
                    onChange={e => setPrenom(e.target.value)} />
                <TextField label="Fonction" name="Fonction" type="number"
                    value={fonction}
                    onChange={e => setFonction(e.target.value)} />
                <Button type="submit" variant="contained" color="secondary">
                    Envoyer
                </Button>
            </form>


            <form onSubmit={handleSubmitGet}>
                <TextField label="IDGASI" name="search" type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)} />
                <Button type="submit" variant="contained" color="secondary">
                    Envoyer
                </Button>
            </form>

            <Tab />

        </div>
    )
}