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
import { UserContext } from './../../../context/user.context'
import { Link } from '@material-ui/core';
import './Navbar.css';
import { SocketContext } from '../../../context/socket.context';
import { IsPermitted } from '../../../utilities/Function';

const drawerWidth = 240;

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
    "&:hover": {
      backgroundColor: "blue",
    }
  }, navBar: {
    position: 'fixed',
    width: drawerWidth,
    backgroundColor: '#fff',
  }

}));

export default function PermanentDrawerLeft() {

  const classes = useStyles();
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [connected, setConnected] = useState(false);

  // Etat de la connection de socket
  useEffect(() => {
    socket.on('etatConnection', (data) => {
      setConnected(true);
    })
  }, [socket])

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    console.log(index)
  };

  return (

    <div className={classes.navBar}>
      <div className={classes.drawerHeader}></div>
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
              <svg height="100px" viewBox="0 0 22 22" width="100px" fill="secondary"><path d="M0 0h24v24H0z" fill="none"></path>
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
              <svg height="100px" viewBox="0 0 22 22" width="100px" fill="secondary"><path d="M0 0h24v24H0z" fill="none"></path>
                <path fill="#c51162" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></svg>

            </StyledBadgeDisconnected>
          }

          <div className={classes.infoAvatar}>
            <p className='titre'>{user.nom}</p>
            <p>{user.fonction}</p>
          </div>
        </div>
      </div>

      <Divider />
      <List>
        {IsPermitted(user, 'sollicitation', 'view') &&
          <ListItem button className='secondary-h-color' component={Link} href="/home" selected={selectedIndex === 1}
            onClick={(event) => handleListItemClick(event, 1)}>
            <ListItemIcon><CreateNewFolderIcon /></ListItemIcon>
            <ListItemText primary='Sollicitation' />
          </ListItem>}

        {IsPermitted(user, 'catalogue', 'view') &&
          <ListItem button className='secondary-h-color' component={Link} href="catalogue" selected={selectedIndex === 2}
            onClick={(event) => handleListItemClick(event, 1)}>
            <ListItemIcon><DvrIcon /></ListItemIcon>
            <ListItemText primary='Catalogue' />
          </ListItem>}

        {IsPermitted(user, 'brs', 'view') &&
          <ListItem button className='secondary-h-color' component={Link} href="#" selected={selectedIndex === 3}
            onClick={(event) => handleListItemClick(event, 1)}>
            <ListItemIcon><FileCopyIcon /></ListItemIcon>
            <ListItemText primary='BRS' />
          </ListItem>}

        {IsPermitted(user, 'dashboard', 'view') &&
          <ListItem button className='secondary-h-color' component={Link} href="#" selected={selectedIndex === 4}
            onClick={(event) => handleListItemClick(event, 1)}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary='Tableau de bord' />
          </ListItem>}

      </List>
      <Divider />
    </div>

  );
}
