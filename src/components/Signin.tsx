import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { auth, signinRequest } from '../code/auth';


export class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { password: '', email: '', error: '' };

        this.handleChange = this.handleChange.bind(this);
        this.clickSubmit = this.clickSubmit.bind(this);
    }
    
    handleChange(field) {
        return (event) => { 
            this.setState({ [field]: event.target.value })
        }
    }

    clickSubmit() {
        const user = {
            email: this.state['email'] || undefined,
            password: this.state['password'] || undefined
        }

        if (!user.email || !user.password) {
            this.setState({error: 'Both email and password are required'});
            return;
        }

        signinRequest(user).then(
            (data: any) => { 
                if (data.error) this.setState({error: data.error})
                else {
                    this.setState({error: ""});
                    auth.authenticate(data, () => {
                        this.props['toggleSignin'](false);
                        this.setState({ password: '', email: '', error: '' })
                    })
                }
            }
        )
    }


    render() {
        return (
            <Dialog open={this.props['signinActive']} onClose={()=>{this.props['toggleSignin'](false)}}>
                <DialogContent>
                    <DialogContentText>
                        Sign in
                    </DialogContentText>
                    <TextField id="email" type="email" label="Email" 
                                value={this.state['email']}
                                required fullWidth variant="outlined" margin="normal"
                                onChange={this.handleChange('email')}
                    />
                    
                    <TextField id="password" type="password" label="Password"
                                value={this.state['password']}
                                required fullWidth variant="outlined" margin="normal"
                                onChange={this.handleChange('password')}
                    />
                    {this.state['error'] && <div>{this.state['error']}</div>}                    
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.clickSubmit}>Sign in</Button>
                    <Button onClick={()=>{this.props['toggleSignin'](false)}}>Close</Button>
                </DialogActions>
            </Dialog>
        )
    }
}