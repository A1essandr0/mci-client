import React from 'react';
import { 
    Paper, List, ListItem, ListItemAvatar, Avatar, 
    ListItemText, ListItemSecondaryAction, IconButton
} from '@material-ui/core';

import Person from '@material-ui/icons/Person';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

import { listUsers } from '../code/users';
import { auth } from '../code/auth';
import { EditUserProfile } from './EditUserProfile';
import { DeleteUserProfile } from './DeleteUserProfile';


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
        listUsers().then((data) => {
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
                                    <ListItem button={true} key={reactKey}>
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