import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import MessageIcon from '@material-ui/icons/Message';
import SendIcon from '@material-ui/icons/Send';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { red } from '@material-ui/core/colors';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.common.white,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: 'black'
      },
    },
  },
}))(MenuItem);

const StyledMenuButton = withStyles( {
  root: {
    backgroundColor: '#ffffff',
    color: '#000000',
    minWidth: '0px',
    width: '50px'
  },
  contained: {
    boxShadow: 'none'
  }
})(Button);


export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledMenuButton
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        onClick={handleClick}
      >
        <MoreHorizIcon style={{ fontSize: '2rem' }}></MoreHorizIcon>
      </StyledMenuButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem>
          <ListItemIcon>
            <SendIcon style={{ color: '#1976d2' }} fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Follow" />
        </StyledMenuItem>
        <StyledMenuItem>
          <ListItemIcon>
            <MessageIcon style={{ color: '#1976d2' }} fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Message" />
        </StyledMenuItem>
        <StyledMenuItem>
          <ListItemIcon>
            <ReportProblemIcon style={{ color: '#d32f2f' }} fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Report" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}
