import React from 'react';

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
type DeleteUserProfileState = {id: number, email: string, error: string}

// TODO refactor with hooks
export class DeleteUserProfile extends React.Component<DeleteUserProfileProps, DeleteUserProfileState> {
    constructor(props: DeleteUserProfileProps) {
        super(props);
        this.state = { id: -100, email: "", error: "" }

        this.clickSubmit = this.clickSubmit.bind(this);
    }

    componentDidUpdate(prevProps: DeleteUserProfileProps) {
        if (this.props.userId !== prevProps.userId) {
            let user = this.props.users
                .filter((item: User) => item.id === this.props.userId) // O(n) search
                [0];
            this.setState({
                id: this.props.userId,
                email: user && user.email
            })
        }
    }

    clickSubmit() {
        const jwt = auth.isAuthenticated();

        removeUser(this.state.id, {t: jwt.token }).then(
            (data: any) => {
                if (!data || data.error) this.setState({error: data.error})
                else {
                    this.setState({error: ""});
                    this.props.toggleDeleteOpen(false);
                    alert(`User ${this.state.email} deleted`)
                    if (jwt.user.id === this.state.id) auth.signOut(()=>{})
                }
        })  
    }


    render() {
        return (
            <Dialog open={this.props.deleteDialogOpen} onClose={()=>{this.props.toggleDeleteOpen(false)}}>
                <DialogContent>
                    <DialogContentText>Delete account for {this.state.email}? This can't be undone</DialogContentText>
                    {this.state.error && <div>{this.state.error}</div>}
                </DialogContent>

                <DialogActions>
                        <Button onClick={this.clickSubmit} color="primary">Delete</Button>
                        <Button onClick={()=>{this.props.toggleDeleteOpen(false)}}>Close</Button>
                </DialogActions>                
            </Dialog>
        )
    }
}