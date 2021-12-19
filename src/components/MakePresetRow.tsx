import React, { FC, ChangeEvent, useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


type MakePresetRowProps = {
    row: number;
    handleFileSelection: (row: number, column: number) => 
        (event: ChangeEvent<HTMLInputElement>) => void;
    handleTypeSelection: (row: number, column: number, type: string) => 
        (event: ChangeEvent<HTMLInputElement>) => void;
    handleTextSelection: (row: number, column: number) => 
        (event: ChangeEvent<HTMLInputElement>) => void;
}

export const MakePresetRow: FC<MakePresetRowProps> = function(props) {
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
                            props.handleTypeSelection(props.row, 1, 'img')(event)
                        }}
                />
                
                <input id={"file_" + props.row + "_one"} type="file" accept="image/png, image/jpeg, image/jpg" 
                        style={{ display: 'none' }} disabled={!imageSelected1}
                        onChange={(event: any) => {
                            if (event.target.files[0]) setImageName1(event.target.files[0].name);
                            props.handleFileSelection(props.row, 1)(event)
                        }}
                />
                <label htmlFor={"file_" + props.row + "_one"}>
                    <Button disabled={!imageSelected1} variant="contained" component="span">Image</Button>
                </label>
                <Typography variant='caption' className="dialogMenuText" component="span">{imageName1}</Typography>

                <input type="radio" name={props.row + "_one"} checked={!imageSelected1} 
                        onChange={(event) => {
                            setImageSelected1(false);
                            props.handleTypeSelection(props.row, 1, 'text')(event)
                        }}
                />
                <TextField disabled={imageSelected1} placeholder="Word" margin="dense" 
                        onChange={props.handleTextSelection(props.row, 1)}
                />
            </div>


            <div className="dialogMenuItem">
                <TextField placeholder="info (optional)" size="small" margin="dense"
                        onChange={props.handleTextSelection(props.row, 0)}
                />
            </div>


            <div className="dialogMenuItemRight">
                <input type="radio" name={props.row + "_two"} checked={imageSelected2} 
                        onChange={(event) => {
                            setImageSelected2(true);
                            props.handleTypeSelection(props.row, 2, 'img')(event);
                        }}
                />

                <input id={"file_" + props.row + "_two"} type="file" accept="image/gif, image/png, image/jpeg, image/jpg" 
                        style={{ display: 'none' }} disabled={!imageSelected2} 
                        onChange={(event: any) => {
                            if (event.target.files[0]) setImageName2(event.target.files[0].name);
                            props.handleFileSelection(props.row, 2)(event);
                        }}
                />
                <label htmlFor={"file_" + props.row + "_two"}>
                    <Button disabled={!imageSelected2} variant="contained" component="span">Image</Button>
                </label>
                <Typography variant='caption' className="dialogMenuText" component="span">{imageName2}</Typography>

                <input type="radio" name={props.row + "_two"} checked={!imageSelected2}
                        onChange={(event) => {
                            setImageSelected2(false);
                            props.handleTypeSelection(props.row, 2, 'text')(event)
                        }}
                />
                <TextField disabled={imageSelected2} placeholder="Word" margin="dense"
                        onChange={props.handleTextSelection(props.row, 2)}
                />
            </div>
            
        </div>
    )
}