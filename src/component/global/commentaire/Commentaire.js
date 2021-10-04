import CommentIcon from '@material-ui/icons/Comment';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Tooltip } from '@material-ui/core';
import Cookie from 'js-cookie';
import axios from 'axios';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { dateFormat, getDateToday } from '../../../utilities/Function';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    tooltip: {
        fontSize: '15px',
        maxWidth: 'none',
    },
    closeMenu:{
        textAlign:'right',
    },
}));

export default function Commentaire(props) {
    const classes = useStyles();
    const [anchorElMenu, setAnchorElMenu] = useState(null);
    const openMenu = Boolean(anchorElMenu);
    const [commentaire, setCommentaire] = useState('')
    const [commentList, setCommentList] = useState([]);

    useEffect(() => {
        setCommentaire('');
        setCommentList([]);
    }, [openMenu])

    const handleClickOpenMenu = (event) => {
        setAnchorElMenu(event.currentTarget);
        axios({
            method: 'get',
            url: 'global/commentaire?n_Article=' + props.formation.n_Article,
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => { setCommentList(response.data) })
    };

    const handleCloseOpenMenu = () => {
        setAnchorElMenu(null);
    };

    const handleAddCommentaire = () => {
        let date = getDateToday();
        axios({
            method: 'put',
            url: 'global/addCommentaire',
            data: { idgasi: props.user.idgasi, n_Article: props.formation.n_Article, commentaire: commentaire, date: date },
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => {
            if (response.status === 200) {
                let newCommentList = [...commentList];
                newCommentList.push({ idgasi: props.user.idgasi, commentaire: commentaire, date: date })
                setCommentList(newCommentList)
            } else {
                console.log('message error')
            }
        })
    }

    const handleDeleteCommentaire = (id) => {
        if (props.user.idgasi === commentList.find((v) => v.id === id).idgasi) {
            axios({
                method: 'put',
                url: 'global/deleteCommentaire',
                data: { id: id },
                headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
            }).then((response) => {
                let newCommentList = commentList.filter((v) => v.id !== id);
                setCommentList(newCommentList)
            })
        }
    }

    return (
        <>


            <Tooltip title="Ajouter un commentaire" aria-label="comm" classes={{ tooltip: classes.tooltip }}>
                <IconButton aria-label="close" color="primary" onClick={handleClickOpenMenu}>
                    <CommentIcon />
                </IconButton>
            </Tooltip>

            <Menu
                id="long-menu"
                anchorEl={anchorElMenu}
                keepMounted
                open={openMenu}
                onClose={handleCloseOpenMenu}
            >

                <List component="nav" aria-label="main">
                    <ListItem>
                        <TextField label=".Commentaire" type="text" size="small" name="comment"
                            value={commentaire} variant="outlined" onChange={(e) => setCommentaire(e.target.value)} />
                        <IconButton disabled={commentaire === ''} aria-label="save" color="primary" onClick={handleAddCommentaire}>
                            <AddIcon />
                        </IconButton>
                    </ListItem>
                    <Divider />
                    {commentList.length > 0
                        ? commentList.map((v, i) => (
                            <ListItem key={i}>
                                <ListItemText primary={v.commentaire}
                                    secondary={`Le ${dateFormat(v.date)} par ${v.user ? v.user : v.idgasi}.`} />
                                {props.user.idgasi === v.idgasi && <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCommentaire(v.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>}
                            </ListItem>
                        ))
                        : <ListItem>
                            <ListItemText primary="Aucune commentaire" />
                        </ListItem>
                    }
                    <ListItem button className={classes.closeMenu} onClick={handleCloseOpenMenu}>
                        <ListItemText secondary="Fermer" />
                    </ListItem>
                </List>


            </Menu>
        </>
    )
}