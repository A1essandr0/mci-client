import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { deletePreset } from '../code/presets';
import { auth } from '../code/auth';


type DeletePresetProps = {

}

// TODO refactor with hooks
export class DeletePreset extends React.Component<any, {presetId: number, error: string}> {
    constructor(props: any) {
        super(props);
        this.state = { presetId: this.props['presetId'], error: "" }

        this.clickSubmit = this.clickSubmit.bind(this);
    }

    componentDidUpdate(prevProps: any) {
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
                    this.props['setGlobalStateParameter']('deletePresetActive', false);
                    alert(`Preset with  id=${this.state['presetId']} deleted`);
                }
        })  
    }


    render() {
        return (
            <Dialog open={this.props['deletePresetActive']} onClose={
                () => { this.props['setGlobalStateParameter']('deletePresetActive', false)}}>
                <DialogContent>
                    <DialogContentText>Delete this preset? This can't be undone</DialogContentText>
                    
                    {this.state['error'] && <div>{this.state['error']}</div>}
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.clickSubmit} color="primary">Delete</Button>
                    <Button onClick={
                        () => { this.props['setGlobalStateParameter']('deletePresetActive', false)}}
                    >Close</Button>
                </DialogActions>                
            </Dialog>
        )
    }
}