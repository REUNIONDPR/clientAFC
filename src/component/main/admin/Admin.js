import axios from 'axios';
import Cookie from 'js-cookie';
import Button from '@material-ui/core/Button';

export default function Admin(props){

    const handleEditionBRS = () => {
        
        axios({
            method:'PUT',
            url:'admin/updateTable',
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => console.log(response))
    }
    return(
        <Button variant="contained" color="primary" onClick={handleEditionBRS}>TEST</Button>
    )
}