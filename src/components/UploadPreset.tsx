import React from 'react';

import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { BlueButton, RedButton } from './ColoredButtons';
import { UploadPresetFile } from './UploadPresetFile';
import { uploadPreset } from '../code/presets';
import { auth } from '../code/auth';
import { arrayRange } from '../code/lib';
import { config } from '../code/config';


// to be deprecated after MakePreset comes into the mix
export class UploadPreset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            presetName: '',
            presetDescription: '', 

            isPlayableByAll: true,
            isViewableByAll: true,
            isViewableByUsers: true,

            cardPairsNum: 8,
            cardFiles: new FormData(),
            backFiles: new FormData(),
            
            error: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleToggleChange = this.handleToggleChange.bind(this);
        this.handleChangeNumberOfPairs = this.handleChangeNumberOfPairs.bind(this);
        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.handleBackFileSelection = this.handleBackFileSelection.bind(this);

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
            if (this.state['cardPairsNum'] === 1 && num === -1 ||
                    this.state['cardPairsNum'] === config.maxCardPairNum && num === 1)
                return;
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

    handleBackFileSelection(fileField) {
        return (event) => {
            this.state['backFiles'].set(fileField, event.target.files[0])
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
            (arrayRange(config.maxCardPairNum, 1).map(
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
        
        let uploadedBackFiles = this.state['backFiles'];
        uploadPreset(uploadedPreset, uploadedPresetFiles, uploadedBackFiles, {t: jwt.token}).then(
            (data: any) => {
                if (!data || data.error) this.setState({error: data.error})
                else {
                    this.setState({
                        error: "",
                        cardFiles: new FormData(),
                        backFiles: new FormData()                        
                    });
                    this.props['setGlobalStateParameter']('uploadPresetActive', false);
                    alert(`Preset named '${uploadedPreset.presetName}' uploaded, refresh the page`);
                }
            }
        )
    }


    render() {
        return (
            <Dialog open={this.props['uploadPresetActive']} maxWidth="xl"
                    onClose={ () => {
                        this.props['setGlobalStateParameter']('uploadPresetActive', false);
                        this.setState({
                            cardFiles: new FormData(),
                            backFiles: new FormData()
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

                    {arrayRange(this.state['cardPairsNum'], 1).map(
                        (nrow, reactKey) => {
                            return (<UploadPresetFile row={nrow} key={reactKey}
                                    handleFileSelection={this.handleFileSelection}
                            />)
                        }
                    )}

                    <div className="dialogMenuBox">
                        <div className="dialogMenuItemRight">
                            <BlueButton color="primary" variant="contained"
                                onClick={this.handleChangeNumberOfPairs(1)}
                            >+</BlueButton>
                            <RedButton color="secondary" variant="contained"
                                onClick={this.handleChangeNumberOfPairs(-1)}
                            >-</RedButton>
                        </div>
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

                    <div className="dialogMenuBox">
                        <Input className="dialogMenuFile" inputProps={{ 
                            accept: "image/gif, image/png, image/jpeg, image/jpg",
                            type: "file"}}
                            onChange={this.handleBackFileSelection('backImg')}
                        />
                        <DialogContentText>Card back (optional)</DialogContentText>
                    </div>
                    <div className="dialogMenuBox">
                        <Input className="dialogMenuFile" inputProps={{
                            accept: "image/gif, image/png, image/jpeg, image/jpg",
                            type: "file"}}
                            onChange={this.handleBackFileSelection('emptyImg')}
                        /><DialogContentText>Empty card (optional)</DialogContentText>
                    </div>

                    {this.state['error'] && <div>{this.state['error']}</div>} 
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.clickSubmit} color="primary">Upload preset</Button>

                    <Button onClick={ () => {
                                this.props['setGlobalStateParameter']('uploadPresetActive', false);
                                this.setState({
                                    cardFiles: new FormData(),
                                    backFiles: new FormData()
                                })
                            }}
                    >Close</Button>
                </DialogActions>
            </Dialog>
        )
    }
}