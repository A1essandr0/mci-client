import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { createUser } from '../code/users';


export class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: '', email: '', password: '', passwordRepeat: '', error: '' }

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
            name: this.state['name'] || undefined,
            email: this.state['email'] || undefined,
            password: this.state['password'] || undefined,
            passwordRepeat: this.state['passwordRepeat'] || undefined
        }

        if (!user.email || !user.password || !user.name || !user.passwordRepeat) {
            this.setState({error: 'All fields are required'});
            return;
        }
        if (user.passwordRepeat !== user.password) {
            this.setState({error: "Passwords don't match"});
            return;
        }

        createUser(user).then(
            (data: any) => { 
                if (data.error) this.setState({error: data.error})
                else {
                    this.setState({error: ""});
                    this.props['setGlobalStateParameter']('signupActive', false);
                    alert(`User ${user.email} created`)
                }
            }
        )            
    }


    render() {
        return (
            <Dialog open={this.props['signupActive']} onClose={
                    () => { this.props['setGlobalStateParameter']('signupActive', false)}}>
                <DialogContent>
                    <DialogContentText>
                        Register
                    </DialogContentText>
                    <TextField id="name" type="text" label="User name" 
                                required fullWidth margin="normal" variant="outlined"
                                value={this.state['name']}
                                onChange={this.handleChange('name')} 
                    />
                    <TextField id="email" type="email" label="Email" 
                                required fullWidth margin="normal" variant="outlined"
                                value={this.state['email']}
                                onChange={this.handleChange('email')} 
                    />
                    <TextField id="password" type="password" label="Password" 
                                required fullWidth margin="normal" variant="outlined"
                                value={this.state['password']}
                                onChange={this.handleChange('password')}
                    />
                    <TextField id="password-repeat" type="password" label="Repeat password" 
                                required fullWidth margin="normal" variant="outlined"
                                value={this.state['passwordRepeat']}
                                onChange={this.handleChange('passwordRepeat')}
                    />
                    {this.state['error'] && <div>{this.state['error']}</div>}
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.clickSubmit}>Sign up</Button>
                    <Button onClick={
                        () => { this.props['setGlobalStateParameter']('signupActive', false)}}
                    >Close</Button>
                </DialogActions>
            </Dialog>           
        )
    }
}