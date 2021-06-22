import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { deletePreset } from '../code/presets';
import { auth } from '../code/auth';


export class DeletePreset extends React.Component {
    constructor(props) {
        super(props);
        this.state = { presetId: this.props['presetId'], error: "" }

        this.clickSubmit = this.clickSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props['presetId'] !== prevProps['presetId']) {
            this.setState({
                presetId: this.props['presetId'],
            })
        }
    }

    clickSubmit() {
        const jwt = auth.isAuthenticated();

        deletePreset(this.state['presetId'], {t: jwt.token }).then(
            (data: any) => {
                if (!data || data.error) this.setState({error: data.error})
                else {
                    this.setState({error: ""});
                    this.props['toggleDeletePreset'](false);
                    alert(`Preset with  id=${this.state['presetId']} deleted`);
                }
        })  
    }


    render() {
        return (
            <Dialog open={this.props['deletePresetActive']} onClose={()=>{this.props['toggleDeletePreset'](false)}}>
                <DialogContent>
                    <DialogContentText>Delete preset {this.state['email']}? This can't be undone</DialogContentText>
                    
                    {this.state['error'] && <div>{this.state['error']}</div>}
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.clickSubmit} color="primary">Delete</Button>
                    <Button onClick={()=>{this.props['toggleDeletePreset'](false)}}>Close</Button>
                </DialogActions>                
            </Dialog>
        )
    }
}