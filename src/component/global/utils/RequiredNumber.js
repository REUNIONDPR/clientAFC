import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';

export default function RequiredNumber(props) {
    const [data, setData] = useState({
        label: '',
        value: '',
        Tkey: '',
        handleChange: '',
    })

    useEffect(() => {
        setData(props)
    }, [props])
    
    return (
        <TextField
            key={'input_number_modal_'+data.label}
            required
            type="number"
            size="small"
            label={data.label}
            variant="outlined"
            error={data.error}
            value={data.value}
            onChange={(e) => data.handleChange(data.Tkey, e.target.value)}
        />
    )

};