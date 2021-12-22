import React, { FC, useState, ChangeEvent } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { createUser } from '../code/users';
import { HigherStateParameterChanger } from 'src/code/globalTypes';


type SignupProps = {
    signupActive: boolean;
    setGlobalStateParameter: HigherStateParameterChanger;
}

export const Signup: FC<SignupProps> = function(props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [error, setError] = useState("");

    const clearFields = function() {
        [setName, setEmail, setPassword, setPasswordRepeat, setError].forEach(
            func => func("")
        )
    }

    const clickSubmit = function() {
        const user = {
            name: name || undefined,
            email: email || undefined,
            password: password || undefined,
            passwordRepeat: passwordRepeat || undefined
        }

        if (!user.email || !user.password || !user.name || !user.passwordRepeat) {
            setError("All fields are required");
            return;
        }
        if (user.passwordRepeat !== user.password) {
            setError("Passwords don't match");
            return;
        }

        createUser(user).then(
            (data: any) => { 
                if (data.error) setError(data.error)
                else {
                    props.setGlobalStateParameter('signupActive', false);
                    alert(`User ${user.email} created`);
                    clearFields();
                }
            }
        )            
    }

    return (
        <Dialog open={props.signupActive} onClose={
                () => { props.setGlobalStateParameter('signupActive', false)}}>
            <DialogContent>
                <DialogContentText>
                    Register
                </DialogContentText>
                <TextField id="name" type="text" label="User name" 
                            required fullWidth margin="normal" variant="outlined"
                            value={name}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)} 
                />
                <TextField id="email" type="email" label="Email" 
                            required fullWidth margin="normal" variant="outlined"
                            value={email}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} 
                />
                <TextField id="password" type="password" label="Password" 
                            required fullWidth margin="normal" variant="outlined"
                            value={password}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                />
                <TextField id="password-repeat" type="password" label="Repeat password" 
                            required fullWidth margin="normal" variant="outlined"
                            value={passwordRepeat}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setPasswordRepeat(event.target.value)}
                />
                {error && <div>{error}</div>}
            </DialogContent>

            <DialogActions>
                <Button onClick={clickSubmit}>Sign up</Button>
                <Button onClick={
                    () => { props.setGlobalStateParameter('signupActive', false)}}
                >Close</Button>
            </DialogActions>
        </Dialog>           
    )
}