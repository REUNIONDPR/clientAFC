import React, { useContext, useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DvrIcon from '@material-ui/icons/Dvr';
import Badge from '@material-ui/core/Badge';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import DashboardIcon from '@material-ui/icons/Dashboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import StorageIcon from '@material-ui/icons/Storage';
import { UserContext } from './../../../context/user.context'
// import { Link } from '@material-ui/core';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { SocketContext } from '../../../context/socket.context';
import { IsPermitted } from '../../../utilities/Function';
import Cookies from 'js-cookie';
import Button from '@material-ui/core/Button';
import { codeToName } from '../../../utilities/Function';
import Skeleton from '@material-ui/lab/Skeleton';

const drawerWidth = '20%';

const StyledBadgeConnected = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}))(Badge);

const StyledBadgeDisconnected = withStyles((theme) => ({
  badge: {
    backgroundColor: '#cacaca',
    color: '#cacaca',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: drawerWidth,
  },
  infoAvatar: {
    height: 60,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  listItem: {
    "&:selected": {
      backgroundColor: "blue",
    }
  }, navBar: {
    // position: 'fixed',
    // width: drawerWidth,
    backgroundColor: '#fff',
  },
  skeleton:{
    marginTop:theme.spacing(1)
  }
}));

export default function PermanentDrawerLeft() {

  const classes = useStyles();
  const { user, deleteUser } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [connected, setConnected] = useState(false);

  // Etat de la connection de socket
  useEffect(() => {
    socket.on('etatConnection', (data) => {
      setConnected(true);
    })
  }, [socket])

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleLogOut = () => {
    Cookies.remove('authTokenAFC', user.token);
    console.log(Cookies.get())
    deleteUser();
  }

  return (

    <div className={classes.navBar}>
      <div className={classes.drawerHeader}><Button variant="contained" onClick={handleLogOut}>Déconnection</Button></div>
      <Divider />

      <div className='card-avatar'>
        <div>
          {connected ?
            <StyledBadgeConnected
              overlap="circle"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              variant="dot"
            >
              <svg height="100px" viewBox="0 0 22 22" width="100px" fill="primary"><path d="M0 0h24v24H0z" fill="none"></path>
                <path fill="#c51162" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></svg>

            </StyledBadgeConnected>
            :
            <StyledBadgeDisconnected
              overlap="circle"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              variant="dot"
            >
              <svg height="100px" viewBox="0 0 22 22" width="100px" fill="primary"><path d="M0 0h24v24H0z" fill="none"></path>
                <path fill="#c51162" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></svg>

            </StyledBadgeDisconnected>
          }

          <div className={classes.infoAvatar}>

            {user.idgasi
              ? <>
                <p className='titre'>{user.nom}</p>
                <p>{codeToName('fonction_' + user.fonction)}</p>
              </>
              : <>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </>}

          </div>
        </div>
      </div>

      <Divider />
      <List>

        {user.idgasi
          ? <>
            {IsPermitted(user, 'formation', 'view') &&
              <ListItem button className='primary-h-color' component={Link} to="/formation" selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}>
                <ListItemIcon><CreateNewFolderIcon /></ListItemIcon>
                <ListItemText secondary='Formation' />
              </ListItem>}

            {IsPermitted(user, 'catalogue', 'view') &&
              <ListItem button className='primary-h-color' component={Link} to="catalogue" selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}>
                <ListItemIcon><DvrIcon /></ListItemIcon>
                <ListItemText secondary='Catalogue' />
              </ListItem>}

            {IsPermitted(user, 'brs', 'view') &&
              <ListItem button className='primary-h-color' component={Link} to="brs" selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}>
                <ListItemIcon><FileCopyIcon /></ListItemIcon>
                <ListItemText secondary='BRS' />
              </ListItem>}

            {IsPermitted(user, 'bdd', 'view') &&
              <ListItem button className='primary-h-color' component={Link} to="bdd" selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}>
                <ListItemIcon><StorageIcon /></ListItemIcon>
                <ListItemText secondary='Base de donnée' />
              </ListItem>}

            {IsPermitted(user, 'admin', 'view') &&
              <ListItem button className='primary-h-color' component={Link} to="admin" selected={selectedIndex === 5}
                onClick={(event) => handleListItemClick(event, 5)}>
                <ListItemIcon><DashboardIcon /></ListItemIcon>
                <ListItemText secondary='Admin' />
              </ListItem>}
          </>
          : <>
            <Skeleton className={classes.skeleton} variant="rect" height={40} />
            <Skeleton className={classes.skeleton} variant="rect" height={40} />
          </>}

      </List>
      <Divider />
    </div>

  );
}
