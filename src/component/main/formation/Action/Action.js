
import TableCell from '@material-ui/core/TableCell';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

export default function ActionTable() {
    return (


        <TableCell align="right">
            <Tooltip title="Editer">
                <IconButton aria-label="Editer" size="small" color="primary" onClick={() => console.log('test')}>
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </TableCell>

    )
};