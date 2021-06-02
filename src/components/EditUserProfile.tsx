import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core';
import { auth } from '../code/auth';
import { updateUser } from '../code/users';


export class EditUserProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = { id: -100, name: "", email: "", error: "" }

        this.handleChange = this.handleChange.bind(this);
        this.clickSubmit = this.clickSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props['userId'] !== prevProps['userId']) {
            let user = this.props['users']
                .filter(item => item.id === this.props['userId'])
                [0];
            this.setState({
                id: this.props['userId'],
                name: user && user['name'],
                email: user && user['email']
            })
        }
    }

    handleChange(field: string) {
        return (event) => {
            this.setState({ [field]: event.target.value })
        }
    }

    clickSubmit() {
        const jwt = auth.isAuthenticated();
        const userModified = {
            id: this.state['id'] || undefined,
            name: this.state['name'] || undefined,
            email: this.state['email'] || undefined
        };
        if (!userModified.email || !userModified.name) {
            this.setState({error: 'All fields are required'});
            return;
        }

        updateUser(userModified, {t: jwt.token }).then(
            (data: any) => {
                if (!data || data.error) this.setState({error: data.error})
                else {
                    this.setState({error: ""});
                    this.props['toggleEditOpen'](false);
                    alert(`User ${this.state['email']} modified`);                    
                }
            }
        )
    }

        
    render() {
        return (
            <Dialog open={this.props['editDialogOpen']} onClose={()=>{this.props['toggleEditOpen'](false)}}>
                <DialogContent>
                    <DialogContentText>Edit user profile</DialogContentText>

                    <TextField id="name" value={this.state['name']} label="UserName"
                                required fullWidth variant="outlined" margin="normal"
                                onChange={this.handleChange('name')}
                    />
                    <TextField id="email" type="email" value={this.state['email']} label="UserEmail"
                                required fullWidth variant="outlined" margin="normal"
                                onChange={this.handleChange('email')}
                    />
                    {this.state['error'] && <div>{this.state['error']}</div>}

                    <DialogActions>
                            <Button onClick={this.clickSubmit} color="primary">Edit</Button>
                            <Button onClick={()=>{this.props['toggleEditOpen'](false)}}>Close</Button>
                    </DialogActions>

                </DialogContent>
            </Dialog>
        )
    }
}