import React, { FC, useState, ChangeEvent } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { auth, signinRequest } from '../code/auth';
import { HigherStateParameterChanger } from 'src/code/globalTypes';


type SigninProps = {
    signinActive: boolean;
    setGlobalStateParameter: HigherStateParameterChanger;
}

export const Signin: FC<SigninProps> = function(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const clearFields = function() {
        [setEmail, setPassword, setError].forEach(
            func => func("")
        )
    }

    const clickSubmit = function() {
        const user = {
            email: email || undefined,
            password: password || undefined
        }

        if (!user.email || !user.password) {
            setError("Both email and password are required");
            return;
        }

        signinRequest(user).then(
            (data: any) => { 
                if (data.error) setError(data.error)
                else {
                    auth.authenticate(data, () => {
                        props.setGlobalStateParameter('signinActive', false);
                        clearFields();
                    })
                }
            }
        )
    }

    return (
        <Dialog open={props['signinActive']} onClose={
                () => {props.setGlobalStateParameter('signinActive', false)} }>
            <DialogContent>
                <DialogContentText>
                    Sign in
                </DialogContentText>
                <TextField id="email" type="email" label="Email" 
                            value={email}
                            required fullWidth variant="outlined" margin="normal"
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                />
                
                <TextField id="password" type="password" label="Password"
                            value={password}
                            required fullWidth variant="outlined" margin="normal"
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                />
                {error && <div>{error}</div>}                    
            </DialogContent>

            <DialogActions>
                <Button onClick={clickSubmit}>Sign in</Button>
                <Button onClick={
                    () => { props.setGlobalStateParameter('signinActive', false)}}
                >Close</Button>
            </DialogActions>
        </Dialog>
    )
}