import React, { FC, useState, useEffect } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { removeUser } from '../code/users';
import { auth } from '../code/auth';
import { User } from 'src/code/globalTypes';


type DeleteUserProfileProps = {
    users: User[];
    userId: number;
    deleteDialogOpen: boolean;
    toggleDeleteOpen: (value: boolean) => void;
}

export const DeleteUserProfile: FC<DeleteUserProfileProps> = function(props) {
    const [id, setId] = useState(-10);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (props.userId > 0) {
            setId(props.userId);
            let user = props.users.filter((item: User) => item.id === props.userId)[0] // O(n) search
            if (user && user.email) setEmail(user.email); 
        }
    }, [props.userId])

    const clickSubmit = function() {
        const jwt = auth.isAuthenticated();

        removeUser(id, {t: jwt.token }).then(
            (data: any) => {
                if (!data || data.error) setError(data.error)
                else {
                    setError("");
                    props.toggleDeleteOpen(false);
                    alert(`User ${email} deleted`)
                    if (jwt.user.id === id) auth.signOut(()=>{})
                }
        })  
    }

    return (
        <Dialog open={props.deleteDialogOpen} onClose={()=>{props.toggleDeleteOpen(false)}}>
            <DialogContent>
                <DialogContentText>Delete account for {email}? This can't be undone</DialogContentText>
                {error && <div>{error}</div>}
            </DialogContent>

            <DialogActions>
                    <Button onClick={clickSubmit} color="primary">Delete</Button>
                    <Button onClick={()=>{props.toggleDeleteOpen(false)}}>Close</Button>
            </DialogActions>                
        </Dialog>
    )
}