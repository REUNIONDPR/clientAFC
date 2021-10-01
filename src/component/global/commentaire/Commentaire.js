import CommentIcon from '@material-ui/icons/Comment';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Cookie from 'js-cookie';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function Commentaire(props) {
    const classes = useStyles();
    const [anchorElMenu, setAnchorElMenu] = useState(null);
    const openMenu = Boolean(anchorElMenu);
    const [commentaire, setCommentaire] = useState('')

    const handleClickOpenMenu = (event) => {
        setAnchorElMenu(event.currentTarget);
        axios({
            method:'get',
            url:'global/commentaire?id='+props.id,
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => {console.log(response.data)})
    };

    const handleCloseOpenMenu = () => {
        setAnchorElMenu(null);
    };

    const handleAddCommentaire = () => {
        axios({
            method:'put',
            url:'global/addCommentaire',
            data:{user:props.user.idgasi, commentaire:commentaire},
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => {console.log(response.data)})
    }
    return (
        <>
            <IconButton aria-label="close" color="primary" onClick={handleClickOpenMenu}>
                <CommentIcon />
            </IconButton>

            <Menu
                id="long-menu"
                anchorEl={anchorElMenu}
                keepMounted
                open={openMenu}
                onClose={handleCloseOpenMenu}
            >

                <List component="nav" aria-label="main mailbox folders">
                    <ListItem>
                        <TextField label="Commentaire" type="text" size="small"
                            value={commentaire} variant="outlined" onChange={(e) => setCommentaire(e.target.value)} />
                        <IconButton disabled={commentaire === ''} aria-label="save" color="primary" onClick={handleAddCommentaire}>
                            <AddIcon />
                        </IconButton>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Drafts" />
                    </ListItem>
                </List>


            </Menu>
        </>
    )
}