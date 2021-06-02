import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core';


export class CreateNewPreset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            presetName: '',
            presetDescription: '', 
            bgColor: null,
            textColor: null,
            backColor: null,
            emptyColor: null,
            isPublic: false,

            cardValues: [],
            cardInfos: [],

            error: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.clickSubmit = this.clickSubmit.bind(this);
    }

    handleChange(field) {
        return (event) => { 
            this.setState({ [field]: event.target.value })
        }
    }

    clickSubmit() {

    }



    render() {
        return (
            <Dialog open={this.props['createPresetActive']} 
                    onClose={()=>{this.props['toggleCreatePreset'](false)}}>
                        <DialogContent>
                            <DialogContentText>
                                Create new preset
                            </DialogContentText>

                            <TextField />
                            {this.state['error'] && <div>{this.state['error']}</div>}
                        </DialogContent>

                        <DialogActions>

                        </DialogActions>
            </Dialog>
        )
    }
}