import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { createPreset } from '../code/presets';
import { auth } from '../code/auth';


export class CreateNewPreset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            presetName: '',
            presetDescription: '', 
            bgColorOne: '#008080',
            bgColorTwo: '#00A0A0',
            textColorOne: '#FFFFFF',
            textColorTwo: '#FFFFFF',
            backColor: '#FFA500',
            emptyColor: '#FFFFFF',

            isPlayableByAll: true,
            isViewableByAll: true,
            isViewableByUsers: true,

            cardValues: '',
            cardInfos: '',

            error: ''
        }

        this.handleToggleChange = this.handleToggleChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    clickSubmit() {
        const jwt = auth.isAuthenticated();

        let newPreset = {
            presetName: this.state['presetName'] || undefined,
            presetDescription: this.state['presetDescription'] || undefined, 
            bgColorOne: this.state['bgColorOne'],
            bgColorTwo: this.state['bgColorTwo'],
            textColorOne: this.state['textColorOne'],
            textColorTwo: this.state['textColorTwo'],
            backColor: this.state['backColor'],
            emptyColor: this.state['emptyColor'],

            isPlayableByAll: this.state['isPlayableByAll'],
            isViewableByAll: this.state['isViewableByAll'],
            isViewableByUsers: this.state['isViewableByUsers'],

            cardValues: this.state['cardValues'] || undefined,
            cardInfos: this.state['cardInfos'] || undefined
        }

        let fieldsAreCorrect = ['presetName','presetDescription','cardValues','cardInfos']
            .map(field => newPreset[field])
            .every(field => field)
        if (!fieldsAreCorrect) {
            this.setState({
                error: 'All text fields are required'
            })
            return;
        }
        let [valuesSplitted, infoSplitted] = [
            this.state['cardValues'].split(';'),
            this.state['cardInfos'].split(';')
        ]
        if (valuesSplitted.length % 2 == 1) {
            this.setState({
                error: 'To form pairs there should be even number of cards'
            })
            return;
        }
        if (valuesSplitted.length != infoSplitted.length) {
            this.setState({
                error: 'Card values and card descriptions should correspond each other'
            })
            return;            
        }

        newPreset.cardValues = valuesSplitted;
        newPreset.cardInfos = infoSplitted;

        createPreset(newPreset, { t: jwt.token}).then(
            (data: any) => {
                if (!data || data.error) this.setState({error: data.error})
                else {
                    this.setState({error: ""});
                    this.props['toggleCreatePreset'](false);
                    alert(`Preset named '${newPreset.presetName}' created`);                    
                }
            }
        )
    }


    render() {
        return (
            <Dialog open={this.props['createPresetActive']} maxWidth="xl"
                    onClose={()=>{this.props['toggleCreatePreset'](false)}}>
                        <DialogContent>
                            <DialogContentText>
                                Create new preset
                            </DialogContentText>

                            <TextField id="presetName" value={this.state['presetName']} label="Preset name"
                                required margin="normal"
                                onChange={this.handleChange('presetName')}
                            />
                            <TextField id="presetDescription" value={this.state['presetDescription']} label="Preset description"
                                required margin="normal"
                                onChange={this.handleChange('presetDescription')}
                            />

                            {/* TODO more convenient interface with field for every word */}
                            <TextField id="cardValues" value={this.state['cardValues']} label="Words on cards"
                                required fullWidth variant="outlined" margin="normal" multiline rows={4}
                                placeholder="Enter card values separated by ';' "
                                onChange={this.handleChange('cardValues')}
                            />
                            <TextField id="cardInfos" value={this.state['cardInfos']} label="Card descriptions"
                                required fullWidth variant="outlined" margin="normal" multiline rows={4}
                                placeholder="Enter card descriptions separated by ';' "
                                onChange={this.handleChange('cardInfos')}
                            />


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
                                    <input type="color" id="textColorOne" value={this.state['textColorOne']}
                                            onChange={this.handleChange('textColorOne')}
                                    />&nbsp;Text color one
                                </div>
                                <div className="dialogMenuItem">
                                    <input type="color" id="textColorTwo" value={this.state['textColorTwo']}
                                            onChange={this.handleChange('textColorTwo')}
                                    />&nbsp;Text color two
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
                            <Button onClick={this.clickSubmit} color="primary">Create preset</Button>
                            <Button onClick={()=>{this.props['toggleCreatePreset'](false)}}>Close</Button>
                        </DialogActions>
            </Dialog>
        )
    }
}