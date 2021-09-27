import { withStyles } from '@material-ui/core/styles';
import { teal, blue, red, green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';


export const BlueButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(blue[500]),
      backgroundColor: blue[500],
      '&:hover': {
        backgroundColor: blue[700],
      },
    },
}))(Button);


export const RedButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(red[500]),
      backgroundColor: red[500],
      '&:hover': {
        backgroundColor: red[700],
      },
    },
}))(Button);


export const GreenButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(teal[500]),
    backgroundColor: green[700],
    '&:hover': {
      backgroundColor: green[900],
    },
  },
}))(Button);

