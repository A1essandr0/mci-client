import React, { FC, useState, useEffect, ChangeEvent } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { auth } from '../code/auth';
import { updateUser } from '../code/users';
import { User } from 'src/code/globalTypes';


type EditUserProfileProps = {
    users: User[];
    userId: number;
    editDialogOpen: boolean;
    toggleEditOpen: (value: boolean) => void;
}

export const EditUserProfile: FC<EditUserProfileProps> = function(props) {
    const [id, setId] = useState(-100);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (props.userId > 0) {
            setId(props.userId);
            let user = props.users.filter((item: User) => item.id === props.userId)[0] // O(n) search
            if (user && user.email) { 
                setEmail(user.email);
                setName(user.name)
            }
        }
    }, [props.userId]);

    const clickSubmit = function() {
        const jwt = auth.isAuthenticated();
        const userModified = {
            id: id || undefined,
            name: name || undefined,
            email: email || undefined
        };
        if (!userModified.email || !userModified.name) {
            setError("All fields are required");
            return;
        }

        updateUser(userModified, {t: jwt.token }).then(
            (data: any) => {
                if (!data || data.error) setError(data.error)
                else {
                    setError("");
                    props.toggleEditOpen(false);
                    alert(`User ${email} modified`);                    
                }
            }
        )
    }

    return (
        <Dialog open={props.editDialogOpen} onClose={()=>{props.toggleEditOpen(false)}}>
            <DialogContent>
                <DialogContentText>Edit user profile</DialogContentText>

                <TextField id="name" value={name} label="UserName"
                            required fullWidth variant="outlined" margin="normal"
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                />
                <TextField id="email" type="email" value={email} label="UserEmail"
                            required fullWidth variant="outlined" margin="normal"
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                />
                {error && <div>{error}</div>}

                <DialogActions>
                        <Button onClick={clickSubmit} color="primary">Edit</Button>
                        <Button onClick={()=>{props.toggleEditOpen(false)}}>Close</Button>
                </DialogActions>

            </DialogContent>
        </Dialog>
    )
}