import React, { FC, useEffect, useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { deletePreset } from '../code/presets';
import { auth } from '../code/auth';
import { HigherStateParameterChanger } from 'src/code/globalTypes';


type DeletePresetProps = {
    presetId: number;
    deletePresetActive: boolean;
    setGlobalStateParameter: HigherStateParameterChanger;
}

export const DeletePreset: FC<DeletePresetProps> = function(props) {
    const [presetId, setPresetId] = useState(-10);
    const [error, setError] = useState("");

    useEffect(() => {
        setPresetId(props.presetId);
    }, [props.presetId])

    const clickSubmit = function() {
        const jwt = auth.isAuthenticated();

        deletePreset(presetId, {t: jwt.token }).then(
            (data: any) => {
                if (!data || data.error) setError(data.error)
                else {
                    setError("");
                    props.setGlobalStateParameter('deletePresetActive', false);
                    alert(`Preset with  id=${presetId} deleted`);
                }
        })  
    }

    return (
        <Dialog open={props.deletePresetActive} onClose={
            () => { props.setGlobalStateParameter('deletePresetActive', false)}}>
            <DialogContent>
                <DialogContentText>Delete this preset? This can't be undone</DialogContentText>
                
                {error && <div>{error}</div>}
            </DialogContent>

            <DialogActions>
                <Button onClick={clickSubmit} color="primary">Delete</Button>
                <Button onClick={
                    () => { props.setGlobalStateParameter('deletePresetActive', false)}}
                >Close</Button>
            </DialogActions>                
        </Dialog>
    )
}