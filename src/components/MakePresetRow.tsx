import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


export function MakePresetRow(props) {
    let [imageSelected1, setImageSelected1] = useState(true);
    let [imageSelected2, setImageSelected2] = useState(true);
    let [imageName1, setImageName1] = useState('No file selected')
    let [imageName2, setImageName2] = useState('No file selected')

    return (
        <div className="dialogMenuBox">

            <div className="dialogMenuItem">
                <input type="radio" name={props.row + "_one"} checked={imageSelected1} 
                        onChange={(event) => {
                            setImageSelected1(true);
                            props.handleSelection('imgType' + 'one_one' + props.row, 'cardtype')(event)
                        }}
                />
                
                <input id={"file_" + props.row + "_one"} type="file" accept="image/gif, image/png, image/jpeg, image/jpg" 
                        style={{ display: 'none' }} disabled={!imageSelected1}
                        onChange={(event) => {
                            if (event.target.files[0]) setImageName1(event.target.files[0].name);
                            props.handleSelection('imgFile' + 'one' + props.row, 'file')(event)
                        }}
                />
                <label htmlFor={"file_" + props.row + "_one"}>
                    <Button disabled={!imageSelected1} variant="contained" component="span">Image</Button>
                </label>
                <Typography variant='caption' className="dialogMenuText" component="span">{imageName1}</Typography>

                <input type="radio" name={props.row + "_one"} checked={!imageSelected1} 
                        onChange={(event) => {
                            setImageSelected1(false);
                            props.handleSelection('imgType' + 'one_two' + props.row, 'cardtype')(event)
                        }}
                />
                <TextField disabled={imageSelected1} placeholder="Word" margin="dense" 
                        onChange={props.handleSelection('imgText' + 'one' + props.row, 'text')}
                />
            </div>


            <div className="dialogMenuItem">
                <TextField placeholder="info (optional)" size="small"
                        margin="dense"
                        onChange={props.handleSelection('imgInfo' + props.row, 'info')}
                />
            </div>


            <div className="dialogMenuItemRight">
                <input type="radio" name={props.row + "_two"} checked={imageSelected2} 
                        onChange={(event) => {
                            setImageSelected2(true);
                            props.handleSelection('imgType' + 'two_one' + props.row, 'cardtype')(event)

                        }}
                />

                <input id={"file_" + props.row + "_two"} type="file" accept="image/gif, image/png, image/jpeg, image/jpg" 
                        style={{ display: 'none' }} disabled={!imageSelected2} 
                        onChange={(event) => {
                            if (event.target.files[0]) setImageName2(event.target.files[0].name);
                            props.handleSelection('imgFile' + 'two' + props.row, 'file')(event)
                        }}
                />
                <label htmlFor={"file_" + props.row + "_two"}>
                    <Button disabled={!imageSelected2} variant="contained" component="span">Image</Button>
                </label>
                <Typography variant='caption' className="dialogMenuText" component="span">{imageName2}</Typography>

                <input type="radio" name={props.row + "_two"} checked={!imageSelected2}
                        onChange={(event) => {
                            setImageSelected2(false);
                            props.handleSelection('imgType' + 'two_two' + props.row, 'cardtype')(event)
                        }}
                />
                <TextField disabled={imageSelected2} placeholder="Word" margin="dense"
                        onChange={props.handleSelection('imgText' + 'two' + props.row, 'text')}
                />
            </div>
            
        </div>
    )
}