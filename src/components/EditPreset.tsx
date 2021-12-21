import React, { FC, useEffect, useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { editPreset } from '../code/presets'
import { auth } from '../code/auth';
import { HigherStateParameterChanger } from 'src/code/globalTypes';


type EditPresetProps = {
    presetId: number;
    presetName: string;
    playableByAll: boolean;
    viewableByAll: boolean;
    viewableByUsers: boolean;

    editPresetActive: boolean;
    setGlobalStateParameter: HigherStateParameterChanger;
}

export const EditPreset: FC<EditPresetProps> = function(props) {
    const [presetId, setPresetId] = useState(-10);
    const [presetName, setPresetName] = useState("");
    const [isPlayableByAll, setIsPlayableByAll] = useState(false);
    const [isViewableByAll, setIsViewableByAll] = useState(false);
    const [isViewableByUsers, setIsViewableByUsers] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        setPresetId(props.presetId);
        setPresetName(props.presetName);
        setIsPlayableByAll(props.playableByAll);
        setIsViewableByAll(props.viewableByAll);
        setIsViewableByUsers(props.viewableByUsers);

    }, [props.presetId])

    const clickSubmit = function() {
        const jwt = auth.isAuthenticated();

        const modifiedAttributes = {
            isPlayableByAll: isPlayableByAll,
            isViewableByAll: isViewableByAll,
            isViewableByUsers: isViewableByUsers
        }
        editPreset(presetId, modifiedAttributes, {t: jwt.token }).then(
            (data: any) => {
                if (!data || data.error) setError(data.error)
                else {
                    setError("");
                    props.setGlobalStateParameter('editPresetActive', false);
                    alert(`Preset with id=${presetId} modified`);
                }
            }
        )
    }

    return (
        <Dialog open={props.editPresetActive} onClose={
            () => { props.setGlobalStateParameter('editPresetActive', false)}}
                maxWidth="xl"
        >
            <DialogContent>
                <DialogContentText>Modify attributes of preset "{presetName}"</DialogContentText>

                <div className="dialogMenuBox">
                    <div className="dialogMenuItem">
                        <input type="checkbox" checked={isPlayableByAll}
                                onChange={() => setIsPlayableByAll(!isPlayableByAll)}
                        />&nbsp;Playable by everyone
                    </div>
                    <div className="dialogMenuItem">
                        <input type="checkbox" checked={isViewableByAll}
                                onChange={() => setIsViewableByAll(!isViewableByAll)}
                        />&nbsp;Viewable by everyone
                    </div>
                    <div className="dialogMenuItem">
                        <input type="checkbox" checked={isViewableByUsers}
                                onChange={() => setIsViewableByUsers(!isViewableByUsers)}
                        />&nbsp;Viewable by any logged in user
                    </div>
                </div>

                {error && <div>{error}</div>} 
            </DialogContent>

            <DialogActions>
                <Button onClick={clickSubmit} color="primary">Apply changes</Button>
                <Button onClick={
                    () => { props.setGlobalStateParameter('editPresetActive', false)}}
                >Close</Button>
            </DialogActions>

        </Dialog>
    )
}