import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';

export default function SelectPersonnalize(props) {
    const [data, setData] = useState();

    useEffect(() => {
        let url = props.path;
        axios({
            method: 'GET',
            url: url,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => setData(response.data));
    }, [props.path])

    return (
        <FormControl size="small" variant="outlined" error={props.error}>
            <InputLabel id="demo-simple-select-outlined-label">{props.label}</InputLabel>
            {data &&
                <Select
                    value={props.value}
                    onChange={(e) => props.handleChangeValue(props.rowKey, e.target.value)}
                    fullWidth
                    label={props.label}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {data.map((v) => (
                        <MenuItem key={v.id + '_' + v.libelle} value={v.id}>{v[props.displayvalue]}</MenuItem>
                    ))}
                </Select>
            }
        </FormControl>
    )
}