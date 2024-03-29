import React, {useState, useEffect } from 'react';

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
import { User } from 'src/code/globalTypes';


export const Users = function() {
    let [userId, setUserId] = useState(-10);
    let [editDialogOpen, setEditDialogOpen] = useState(false);
    let [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    let [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const jwt = auth.isAuthenticated();
        if (!jwt) return;

        listUsers({t: jwt.token}).then(
                (data) => { 
                    if (data.error) console.log(data.error)
                    else setUsers(data);
                })
    }, []);

    let userIsAuthenticated = auth.isAuthenticated();

    return (
            <div className="usersEditView">
                <Paper elevation={4}>
                    <List dense>
                        {users && users.map(
                            (item: User, reactKey) => {
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
                                                        onClick={()=>{ 
                                                            setUserId(item.id);
                                                            setEditDialogOpen(true);
                                                        }}
                                            ><Edit /></IconButton>}

                                            {(userIsAuthenticated.user.is_admin === 1 ||
                                                userIsAuthenticated.user.id === item.id) &&
                                            <IconButton color="secondary"
                                                        onClick={()=>{
                                                            setUserId(item.id);
                                                            setDeleteDialogOpen(true);
                                                        }}
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

                <EditUserProfile users={users}
                                    userId={userId}
                                    editDialogOpen={editDialogOpen}
                                    toggleEditOpen={(value: boolean): void => setEditDialogOpen(value)}
                />
                <DeleteUserProfile users={users}
                                    userId={userId}
                                    deleteDialogOpen={deleteDialogOpen}
                                    toggleDeleteOpen={(value: boolean): void => setDeleteDialogOpen(value)}
                />
        </div>
    )
}