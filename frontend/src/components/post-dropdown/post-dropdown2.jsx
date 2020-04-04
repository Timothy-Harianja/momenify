import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import MessageIcon from '@material-ui/icons/Message';
import SendIcon from '@material-ui/icons/Send';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import "./post-dropdown2.css";

const PostDropdown = () => {
    return (
        <Dropdown classname="dropdown">
            <Dropdown.Toggle className="dropdown-toggle" variant="" id="dropdown-basic">
                <MoreHorizIcon style={{ fontSize: '2rem'}}></MoreHorizIcon>
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu">
                <Dropdown.Item href="#/action-1">
                    <SendIcon style={{ color: '#1976d2' }} fontSize="small" />
                    <span>Follow</span>
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2">
                    <MessageIcon style={{ color: '#1976d2' }} fontSize="small" />
                    <span>Message</span>
                </Dropdown.Item>
                <Dropdown.Item href="#/action-3">
                    <ReportProblemIcon style={{ color: '#d32f2f' }} fontSize="small" />
                    <span>Report</span>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default PostDropdown;