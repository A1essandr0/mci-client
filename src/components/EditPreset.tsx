import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { editPreset } from '../code/presets'
import { auth } from '../code/auth';


export class EditPreset extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            presetId: this.props['presetId'],
            presetName: this.props['presetName'],
            isPlayableByAll: this.props['playableByAll'],
            isViewableByAll: this.props['viewableByAll'],
            isViewableByUsers: this.props['viewableByUsers'],

            error: ""
        };

        this.clickSubmit = this.clickSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props['presetId'] !== prevProps['presetId']) {
            this.setState({
                presetId: this.props['presetId'],
                presetName: this.props['presetName'],
                isPlayableByAll: this.props['playableByAll'],
                isViewableByAll: this.props['viewableByAll'],
                isViewableByUsers: this.props['viewableByUsers'],
            })
        }
    }

    handleToggleChange(field) {
        return (event) => {
            this.setState({ [field]: !this.state[field] })
        }
    }

    clickSubmit() {
        const jwt = auth.isAuthenticated();

        const modifiedAttributes = {
            isPlayableByAll: this.state['isPlayableByAll'],
            isViewableByAll: this.state['isViewableByAll'],
            isViewableByUsers: this.state['isViewableByUsers']
        }
        editPreset(this.state['presetId'], modifiedAttributes, {t: jwt.token }).then(
            (data: any) => {
                if (!data || data.error) this.setState({error: data.error})
                else {
                    this.setState({error: ""});
                    this.props['toggleEditPreset'](false);
                    alert(`Preset with id=${this.state['presetId']} modified`);
                }
            }
        )
    }


    render() {
        return (
            <Dialog open={this.props['editPresetActive']} onClose={()=>{this.props['toggleEditPreset'](false)}}
                    maxWidth="xl"
            >
                <DialogContent>
                    <DialogContentText>Modify attributes of preset "{this.state['presetName']}"</DialogContentText>

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
                    <Button onClick={this.clickSubmit} color="primary">Apply changes</Button>
                    <Button onClick={() => {this.props['toggleEditPreset'](false)}}>Close</Button>
                </DialogActions>

            </Dialog>
        )
    }
}