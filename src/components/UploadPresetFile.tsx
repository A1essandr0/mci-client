import React from 'react';
import { Input } from '@material-ui/core';


export function UploadPresetFile(props) {
    return (
        <div className="dialogMenuBox">            
            <Input className="dialogMenuFile" inputProps={
                    { accept: "image/gif, image/png, image/jpeg, image/jpg",
                        type: "file"}}
                onChange={props.handleFileSelection('imgFile' + props.row + 'one')}
            />
                                
            <Input className="dialogMenuFile" inputProps={
                    { accept: "image/gif, image/png, image/jpeg, image/jpg",
                        type: "file"}}
                onChange={props.handleFileSelection('imgFile' + props.row + 'two')}
            />

            <Input type="text" className="dialogMenuFileText" placeholder="info (optional)"
                    onChange={props.handleFileSelection('imgInfo' + props.row, true)}
            />
        </div>
    )
}