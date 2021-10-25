import React from 'react';

import Input from '@material-ui/core/Input';
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

            cardData: new FormData(),
            backFileName: 'No file selected',
            emptyFileName: 'No file selected',

            error: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleChangeNumberOfPairs = this.handleChangeNumberOfPairs.bind(this);
        this.clickSubmit = this.clickSubmit.bind(this);
    }

    handleChange(field: string) {
        return (event) => { 
            this.setState({ [field]: event.target.value })
        }
    }

    handleToggleChange(field: string) {
        return (event) => {
            this.setState({ [field]: !this.state[field] })
        }
    }

    handleChangeNumberOfPairs(num: number) {
        return (event) => {
            if (this.state['cardPairsNum'] === 1 && num === -1 ||
                    this.state['cardPairsNum'] === config.maxCardPairNum && num === 1)
                return;
            this.setState({ cardPairsNum: this.state['cardPairsNum'] + num})
        }
    }


    handleSelection(field: string, fieldType: string) {
        return (event) => {
            switch (fieldType) {
                case 'file':
                    if (event.target.files && event.target.files[0]) {
                        this.state['cardData'].set(field, event.target.files[0]);
                    }
                    break;
                case 'text':
                    this.state['cardData'].set(field, event.target.value)
                    break;
                case 'info':
                    this.state['cardData'].set(field, event.target.value)
                    break;
                case 'cardtype':
                    console.log(field);
                    // this.state['cardData'].set(field, fieldType)
                    break;
            }


        }
    }



    clickSubmit() {
        const jwt = auth.isAuthenticated();

        // TODO check data

        alert('submitting...');
        for (let item of this.state['cardData'].entries()) console.log(item);
    
    }


    render() {
        return (
            <Dialog open={this.props['makePresetActive']} maxWidth="xl"
                    onClose={ () => { 
                        this.props['setGlobalStateParameter']('makePresetActive', false)
                        this.setState({
                            cardData: new FormData(),
                        })
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
                                                handleSelection={this.handleSelection}
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
                            <input id={"file_cardback"} type="file" accept="image/gif, image/png, image/jpeg, image/jpg" 
                                    style={{ display: 'none' }} 
                                    onChange={(event) => {
                                        if (event.target.files[0]) this.setState({ backFileName: event.target.files[0].name})
                                        this.handleSelection('imgFileCardBack', 'file')(event)
                                    }} 
                            />
                            <label htmlFor={"file_cardback"}>
                                <Button variant="contained" component="span">Back image (optional)</Button>
                            </label>
                        </div>
                        <Typography variant='caption' className="dialogMenuText" component="span">{this.state['backFileName']}</Typography>

                        <div className="dialogMenuItem">
                            <input id={"file_cardempty"} type="file" accept="image/gif, image/png, image/jpeg, image/jpg" 
                                    style={{ display: 'none' }} 
                                    onChange={(event) => {
                                        if (event.target.files[0]) this.setState({ emptyFileName: event.target.files[0].name})
                                        this.handleSelection('imgFileCardEmpty', 'file')(event)
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
                                this.setState({
                                    cardData: new FormData(),
                                })
                            }}
                    >Close</Button>
                </DialogActions>
            </Dialog>
        )
    }
}