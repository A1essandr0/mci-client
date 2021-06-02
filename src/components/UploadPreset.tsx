import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core';


export class UploadPreset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            presetName: '',
            presetDescription: '', 
            backFile: null,
            emptyFile: null,
            isPublic: false,

            cardFilenames: [],
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
            <Dialog open={this.props['uploadPresetActive']}
                    onClose={()=>{this.props['toggleUploadPreset'](false)}}>
                        <DialogContent>
                            <DialogContentText>
                                Upload preset
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