import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core';
import { UploadPresetFile } from './UploadPresetFile';
import { uploadPreset } from '../code/presets';
import { auth } from '../code/auth';


export class UploadPreset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            presetName: '',
            presetDescription: '', 

            isPlayableByAll: true,
            isViewableByAll: true,
            isViewableByUsers: true,

            cardPairsNum: 4,
            cardFiles: new FormData(),
            backFile: null,
            emptyFile: null,
            
            error: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleToggleChange = this.handleToggleChange.bind(this);
        this.handleChangeNumberOfPairs = this.handleChangeNumberOfPairs.bind(this);
        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.clickSubmit = this.clickSubmit.bind(this);
    }

    handleChange(field) {
        return (event) => { 
            this.setState({ [field]: event.target.value })
        }
    }

    handleToggleChange(field) {
        return (event) => {
            this.setState({ [field]: !this.state[field] })
        }
    }

    handleChangeNumberOfPairs(num) {
        return (event) => {
            if (this.state['cardPairsNum'] === 0 && num === -1 ||
                    this.state['cardPairsNum'] === 5 && num === 1)
                num = 0;
            this.setState({ cardPairsNum: this.state['cardPairsNum'] + num})
        }
    }

    handleFileSelection(fileField, info=false) {
        return (event) => {
            if (!info)
                this.state['cardFiles'].set(fileField, event.target.files[0])
            else
                this.state['cardFiles'].set(fileField, event.target.value)
        }
    }


    clickSubmit() {
        const jwt = auth.isAuthenticated();

        let uploadedPreset = {
            presetName: this.state['presetName'] || undefined,
            presetDescription: this.state['presetDescription'] || undefined,

            isPlayableByAll: this.state['isPlayableByAll'],
            isViewableByAll: this.state['isViewableByAll'],
            isViewableByUsers: this.state['isViewableByUsers'],

            backFile: this.state['backFile'] || undefined,
            emptyFile: this.state['emptyFile'] || undefined,
        };

        let fieldsAreCorrect = ['presetName','presetDescription']
            .map(field => uploadedPreset[field])
            .every(field => field)
        if (!fieldsAreCorrect) {
            this.setState({
                error: 'All text fields are required'
            })
            return;
        }

        let uploadedPresetFiles = this.state['cardFiles'];
        // checking whether file list is not empty
        // and whether pairs are formed correctly
        let fileListIsCorrect = !uploadedPresetFiles.entries().next().done && 
            ([1,2,3,4,5].map(
                    i => uploadedPresetFiles.has(`imgFile${i}one`) && uploadedPresetFiles.has(`imgFile${i}two`) ||
                        (!uploadedPresetFiles.has(`imgFile${i}one`) && !uploadedPresetFiles.has(`imgFile${i}two`))
                ).every(condition => condition)
            );

        if (!fileListIsCorrect) {
            this.setState({
                error: "Image pairs weren't formed properly"
            })
            return;
        }
                

        uploadPreset(uploadedPreset, uploadedPresetFiles, {t: jwt.token}).then(
            (data: any) => {
                if (!data || data.error) this.setState({error: data.error})
                else {
                    this.setState({error: ""});
                    this.props['toggleUploadPreset'](false);
                    alert(`Preset named '${uploadedPreset.presetName}' uploaded`);
                }
            }
        )
    }


    render() {
        return (
            <Dialog open={this.props['uploadPresetActive']}
                    onClose={ () => {
                        this.props['toggleUploadPreset'](false);
                        this.setState({
                            cardFiles: new FormData()
                        })
                    }}
            >
                <DialogContent>
                    <DialogContentText>
                        Upload preset
                    </DialogContentText>
                
                    <TextField id="presetName" value={this.state['presetName']} label="Preset name"
                        required margin="normal"
                        onChange={this.handleChange('presetName')}
                    />
                    <TextField id="presetDescription" value={this.state['presetDescription']} label="Preset description"
                        required margin="normal"
                        onChange={this.handleChange('presetDescription')}
                    />


                    {Array.from(
                        {length: this.state['cardPairsNum']}, (a, b) => b+1
                    ).map(
                        (nrow, reactKey) => {
                            return (<UploadPresetFile row={nrow} key={reactKey}
                                    handleFileSelection={this.handleFileSelection}
                            />)
                        }
                    )}

                    <div className="dialogMenuBox">
                        <Button color="primary" variant="contained"
                            onClick={this.handleChangeNumberOfPairs(1)}
                        >+</Button>
                        <Button color="secondary" variant="contained"
                            onClick={this.handleChangeNumberOfPairs(-1)}
                        >-</Button>
                    </div>


                    <div className="dialogMenuBox">
                        <div className="dialogMenuItem">
                            <input type="checkbox" checked={this.state['isPlayableByAll']}
                                    onChange={this.handleToggleChange('isPlayableByAll')}
                            />&nbsp;Playable by everyone
                        </div>
                        <div className="dialogMenuItem">
                            <input type="checkbox" checked={this.state['isViewableByAll']}
                                    onChange={this.handleToggleChange('isViewableByAll')}
                            />&nbsp;Viewable by everyone
                        </div>
                        <div className="dialogMenuItem">
                            <input type="checkbox" checked={this.state['isViewableByUsers']}
                                    onChange={this.handleToggleChange('isViewableByUsers')}
                            />&nbsp;Viewable by any logged in user
                        </div>
                    </div>


                    {/* TODO card backs                             */}


                    {this.state['error'] && <div>{this.state['error']}</div>} 
                </DialogContent>

                <DialogActions>
                    {/* TODO причесать кпопки */}
                    <Button onClick={this.clickSubmit} color="primary">Upload preset</Button>

                    <Button onClick={ () => {
                                this.props['toggleUploadPreset'](false);
                                this.setState({
                                    cardFiles: new FormData()
                                })        
                            }}
                    >Close</Button>
                </DialogActions>
            </Dialog>
        )
    }
}