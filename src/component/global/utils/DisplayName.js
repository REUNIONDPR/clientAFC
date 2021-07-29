import axios from "axios";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";

export default function DisplayName(props) {
    const [data, setData] = useState(props.variable);
    useEffect(() => {
        let isMounted = true;
        axios.get(`global/findName?v=${props.variable}&t=${props.table}`, {
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((r) => { if (isMounted) setData(r.data[0].libelle) });
        return () => { isMounted = false }
    }, [props])
    return (
        <span>{data}</span>
    );
}