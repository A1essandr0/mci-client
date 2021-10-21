import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


export function MakePresetRow(props) {
    return (

        <div className="dialogMenuBox">

            <div className="dialogMenuItem">
                <input type="radio" name={props.row + "_one"}/>

                <input id={"file_" + props.row + "_one"} type="file" accept="image/gif, image/png, image/jpeg, image/jpg" 
                        style={{ display: 'none' }} onChange={props.handleSelection('imgFile' + props.row + 'one', true)} />
                <label htmlFor={"file_" + props.row + "_one"}>
                    <Button variant="contained" component="span">File</Button>
                </label>

                <input type="radio" name={props.row + "_one"}/>
                <TextField className="dialogMenuFileText" variant="outlined" placeholder="Word" margin="dense"
                            onChange={props.handleSelection('imgText' + props.row + 'one', true)}/>

            </div>

            <div className="dialogMenuItem">
                <TextField placeholder="info (optional)"
                        margin="dense" variant="filled"
                        onChange={props.handleSelection('imgInfo' + props.row, true)}
                />
            </div>

            <div className="dialogMenuItem">
                <input type="radio" name={props.row + "_two"}/>

                <input id={"file_" + props.row + "_two"} type="file" accept="image/gif, image/png, image/jpeg, image/jpg" 
                        style={{ display: 'none' }} onChange={props.handleSelection('imgFile' + props.row + 'two', true)}/>
                <label htmlFor={"file_" + props.row + "_two"}>
                    <Button variant="contained" component="span">File</Button>
                </label>


                <input type="radio" name={props.row + "_two"}/>
                <TextField className="dialogMenuFileText" variant="outlined" placeholder="Word" margin="dense"
                            onChange={props.handleSelection('imgText' + props.row + 'two', true)} />
            </div>
            
        </div>
    )
}