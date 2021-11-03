import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { BlueButton, RedButton } from './ColoredButtons';
import { MakePresetRow } from './MakePresetRow';
import { makePreset } from '../code/presets';
import { auth } from '../code/auth';
import { config } from '../code/config';
import { arrayRange } from '../code/lib';


const makeFieldName = function(a, b) {
    return String(a) + '_' + String(b);
}


export class MakePreset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            presetName: '',
            presetDescription: '',

            bgColorOne: '#008080',
            bgColorTwo: '#00A0A0',
            backColor: '#FFA500',
            emptyColor: '#FFFFFF', 

            isPlayableByAll: true,
            isViewableByAll: true,
            isViewableByUsers: true,

            cardPairsNum: 2,

            cardTypes: {},
            cardFiles: {},
            cardTexts: {},

            backFileName: 'No file selected',
            emptyFileName: 'No file selected',

            error: ''
        }

        this.clickSubmit = this.clickSubmit.bind(this);
        this.clearFormData = this.clearFormData.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNumberOfPairs = this.handleChangeNumberOfPairs.bind(this);
        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.handleTypeSelection = this.handleTypeSelection.bind(this);
        this.handleTextSelection = this.handleTextSelection.bind(this);
    }

    clearFormData() {
        this.setState({
            cardFiles: {},
            cardTexts: {},
            cardTypes: {},
            backFileName: 'No file selected',
            emptyFileName: 'No file selected'
        })
    }

    handleChange(field: string) {
        return (event) => { 
            this.setState({ [field]: event.target.value })
        }
    }

    handleToggleChange(field: string) {
        return (event) => {
            this.setState((state) => {
                return {
                    [field]: !state[field]
                }
            })
        }
    }

    handleChangeNumberOfPairs(num: number) {
        return (event) => {
            if (this.state['cardPairsNum'] === 1 && num === -1 ||
                    this.state['cardPairsNum'] === config.maxCardPairNum && num === 1)
                return;
            this.setState((state) => {
                return {
                    cardPairsNum: state['cardPairsNum'] + num
                }
            })
        }
    }

    handleTypeSelection(row: number, column: number, type: string) {
        return (event) => {
            let fieldName = makeFieldName(row, column);
            let cardTypesNew = {
                ...this.state['cardTypes'],
                [fieldName]: type
            };
            this.setState({
                cardTypes: cardTypesNew
            })
        }
    }

    handleFileSelection(row: number, column: number) {
        return (event) => {
            if (event.target.files && event.target.files[0]) {
                let fieldName = makeFieldName(row, column);
                let cardFilesNew = {
                    ...this.state['cardFiles'],
                    [fieldName]: event.target.files[0]
                }
                this.setState({
                    cardFiles: cardFilesNew
                })
            }
        }
    }

    handleTextSelection(row: number, column: number) {
        return (event) => {
            let fieldName = makeFieldName(row, column);
            let cardTextsNew = {
                ...this.state['cardTexts'],
                [fieldName]: event.target.value
            }
            this.setState({
                cardTexts: cardTextsNew
            })
        }
    }

    // TODO extract methods
    clickSubmit() {
        const jwt = auth.isAuthenticated();

        let newPreset = {
            presetName: this.state['presetName'] || undefined,
            presetDescription: this.state['presetDescription'] || undefined,

            bgColorOne: this.state['bgColorOne'],
            bgColorTwo: this.state['bgColorTwo'],
            backColor: this.state['backColor'],
            emptyColor: this.state['emptyColor'],

            isPlayableByAll: this.state['isPlayableByAll'],
            isViewableByAll: this.state['isViewableByAll'],
            isViewableByUsers: this.state['isViewableByUsers'],
        };

        const requiredFields = ['presetName','presetDescription'];
        const requiredFieldsAreCorrect = requiredFields
            .map(field => newPreset[field])
            .every(field => field)
        if (!requiredFieldsAreCorrect) {
            this.setState({
                error: `Text fields are required: ${requiredFields}`
            })
            return;
        }

        // checking whether all image files are taken into account
        let newTypesRecords = {};
        for (let key in this.state['cardFiles']) {
            let fileRecordExists = key in this.state['cardTypes'];
            if (!fileRecordExists) {
                newTypesRecords = {
                    ...newTypesRecords,
                    [key]: 'img'
                }
            }
        }
        newTypesRecords = {...this.state['cardTypes'], ...newTypesRecords};

        // checking special case of metadata without data
        let typesKeys = Object.keys(newTypesRecords);
        if (typesKeys.length < 2 || (typesKeys.length === 2 && '0_1' in newTypesRecords && '0_0' in newTypesRecords)) {
            this.setState({
                error: `Preset is empty`
            });
            return;
        }

        let newFilesRecords = {...this.state['cardFiles']};
        let newTextsRecords = {...this.state['cardTexts']};
        for (let key in newTypesRecords) {
            // dropping redundant images / words
            if (key in newTextsRecords && newTypesRecords[key] === 'img') delete newTextsRecords[key];
            if (key in newFilesRecords && newTypesRecords[key] === 'text') delete newFilesRecords[key];

            // checking whether pairs are formed correctly
            let [row, column] = key.split('_');
            if (row === '0' || column === '0') continue;
            let pairedKey = `${row}_${Number(column) % 2 + 1}`;

            let pairExists = pairedKey in newTypesRecords;
            if (!pairExists) {
                this.setState({
                    error: "Image pairs weren't formed properly"
                })
                return;            
            }

            let fieldIsNull = (newTypesRecords[key] === 'img' && !newFilesRecords[key]) ||
                (newTypesRecords[key] === 'text' && !newTextsRecords[key])
            if (fieldIsNull) {
                this.setState({
                    error: "One or more of required fields ar empty"
                })
                return;
            }
        }

        let presetFiles = newFilesRecords;
        newPreset['texts'] = newTextsRecords;
        newPreset['types'] = newTypesRecords;
        makePreset(newPreset, presetFiles, {t: jwt.token})
            .then(
                (data: any) => {
                    if (!data || data.error) this.setState({error: data.error})
                    else {
                        this.setState({error: ""});
                        this.clearFormData();
                        this.props['setGlobalStateParameter']('makePresetActive', false);
                        alert(`Preset named '${newPreset.presetName}' created`);
                    }
                }
        )
    }


    // TODO extract components
    render() {
        return (
            <Dialog open={this.props['makePresetActive']} maxWidth="xl"
                    onClose={ () => { 
                        this.props['setGlobalStateParameter']('makePresetActive', false)
                        this.clearFormData();
                    }}>

                <DialogContent>
                    <DialogContentText>
                        Make new preset
                    </DialogContentText>
                    <div className="dialogMenuBox">
                        <div className="dialogMenuItem">
                            <TextField id="presetName" value={this.state['presetName']} label="Preset name"
                                required margin="normal"
                                onChange={this.handleChange('presetName')}
                            />
                        </div>
                        <div className="dialogMenuItem">
                            <TextField id="presetDescription" value={this.state['presetDescription']} label="Preset description"
                                required margin="normal"
                                onChange={this.handleChange('presetDescription')}
                            />
                        </div>
                    </div>
                    <Divider />

                    {arrayRange(this.state['cardPairsNum'], 1).map(
                        (row, reactKey) => <MakePresetRow key={reactKey} row={row} 
                                                handleFileSelection={this.handleFileSelection}
                                                handleTypeSelection={this.handleTypeSelection}
                                                handleTextSelection={this.handleTextSelection}
                                            />
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
                    <Divider />

                    <div className="dialogMenuBox">
                        <div className="dialogMenuItem">
                            <input id={"file_cardback"} type="file" accept="image/png, image/jpeg, image/jpg" 
                                    style={{ display: 'none' }} 
                                    onChange={(event) => {
                                        if (event.target.files[0]) this.setState({ backFileName: event.target.files[0].name})
                                        this.handleFileSelection(0, 0)(event)
                                    }} 
                            />
                            <label htmlFor={"file_cardback"}>
                                <Button variant="contained" component="span">Back image (optional)</Button>
                            </label>
                        </div>
                        <Typography variant='caption' className="dialogMenuText" component="span">{this.state['backFileName']}</Typography>

                        <div className="dialogMenuItem">
                            <input id={"file_cardempty"} type="file" accept="image/png, image/jpeg, image/jpg" 
                                    style={{ display: 'none' }} 
                                    onChange={(event) => {
                                        if (event.target.files[0]) this.setState({ emptyFileName: event.target.files[0].name})
                                        this.handleFileSelection(0, 1)(event)
                                    }} 
                            />
                            <label htmlFor={"file_cardempty"}>
                                <Button variant="contained" component="span">Empty image (optional)</Button>
                            </label>
                        </div>
                        <Typography variant='caption' className="dialogMenuText" component="span">{this.state['emptyFileName']}</Typography>
                    </div>
                    
                    <div className="dialogMenuBox">
                        <div className="dialogMenuItem">
                            <input type="color" id="bgColorOne" value={this.state['bgColorOne']}
                                    onChange={this.handleChange('bgColorOne')}
                                />&nbsp;Background color one
                        </div>
                        <div className="dialogMenuItem">
                            <input type="color" id="bgColorTwo" value={this.state['bgColorTwo']}
                                    onChange={this.handleChange('bgColorTwo')}
                                />&nbsp;Background color two
                        </div>

                        <div className="dialogMenuItem">
                            <input type="color" id="backColor" value={this.state['backColor']}
                                    onChange={this.handleChange('backColor')}
                            />&nbsp;Back color
                        </div>
                        <div className="dialogMenuItem">
                            <input type="color" id="emptyColor" value={this.state['emptyColor']}
                                    onChange={this.handleChange('emptyColor')}
                            />&nbsp;Empty color
                        </div>
                    </div>
                    <Divider />

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

                    {this.state['error'] && <div>{this.state['error']}</div>}
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.clickSubmit} color="primary">Make preset</Button>
                    <Button onClick={ () => { 
                                this.props['setGlobalStateParameter']('makePresetActive', false)
                                this.clearFormData();
                            }}
                    >Close</Button>
                </DialogActions>
            </Dialog>
        )
    }
}