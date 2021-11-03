import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

import Person from '@material-ui/icons/Person';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

import { listUsers } from '../code/users';
import { auth } from '../code/auth';
import { EditUserProfile } from './EditUserProfile';
import { DeleteUserProfile } from './DeleteUserProfile';


// TODO rewrite to hooks
export class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            users: [],
            
            userId: -10,
            editDialogOpen: false,
            deleteDialogOpen: false,

            toggleEditOpen: function(value: boolean): void {
                this.setState({ editDialogOpen: value})
            }.bind(this),
            toggleDeleteOpen: function(value: boolean): void {
                this.setState({ deleteDialogOpen: value})
            }.bind(this)
        }
    }

    componentDidMount() {
        const jwt = auth.isAuthenticated();
        if (!jwt) return;

        listUsers({t: jwt.token}).then((data) => {
            if (data.error) console.log(data.error)
            else this.setState({ users: data })            
        })
    }


    render() {
        let userIsAuthenticated = auth.isAuthenticated();

        return (
            <div className="usersEditView">
                <Paper elevation={4}>
                    <List dense>
                        {this.state['users'] && this.state['users'].map(
                            (item, reactKey) => {
                                return (
                                    <ListItem button={false} key={reactKey}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <Person />
                                            </Avatar>
                                        </ListItemAvatar>
    
                                    <ListItemText primary={item.name} 
                                        secondary={userIsAuthenticated.user.is_admin === 1 && item.email}
                                    />
                                        <ListItemSecondaryAction>

                                            {(userIsAuthenticated.user.is_admin === 1 || 
                                                userIsAuthenticated.user.id === item.id) && 
                                            <IconButton color="primary"
                                                        onClick={()=>{ this.setState({ 
                                                            userId: item.id, editDialogOpen: true
                                                        })}}
                                            ><Edit /></IconButton>}

                                            {(userIsAuthenticated.user.is_admin === 1 ||
                                                userIsAuthenticated.user.id === item.id) &&
                                            <IconButton color="secondary"
                                                        onClick={()=>{ this.setState({
                                                            userId: item.id, deleteDialogOpen: true
                                                        })}}
                                            ><Delete /></IconButton>}

                                            <IconButton>
                                                <ArrowForward/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                        })}
                    </List>
                </Paper>

                <EditUserProfile {...this.state} />
                <DeleteUserProfile {...this.state} />
            </div>
        )
    }
}