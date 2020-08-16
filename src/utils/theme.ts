import { ThemeOptions } from '@material-ui/core'
import { red, lightBlue } from '@material-ui/core/colors'

const theme: ThemeOptions = {
  overrides: {
    MuiAppBar: {
      root: {
        padding: 0,
        margin: 0,
        boxShadow: 'none',
        MozBoxShadow: 'none',
        WebkitBoxShadow: 'none'
      }
    },
    MuiDrawer: {
      paper: {
        padding: 0,
        margin: 0
      }
    },
    MuiToolbar: {
      root: {
        boxShadow: 'none'
      }
    },
    MuiFormControl: {
      root: {
        marginBottom: 16
      }
    },
    MuiCardHeader: {
      root: {
        padding: 32
      }
    },
    MuiCardContent: {
      root: {
        padding: '0 32px 32px 32px'
      }
    },
    MuiCardActions: {
      root: {
        padding: '0 32px 32px 26px'
      }
    },
    MuiMenu: {
      paper: {
        padding: 0,
      }
    },
    MuiButton: {
      root: {
        textTransform: 'none'
      }
    },
    MuiDialog: {
      root: {
        '@media only screen and (max-width: 1023px)': {
          marginLeft: -30,
          width: 'calc(100vw + 60px)'
        }
      }
    },
    MuiDialogActions: {
      root: {
        padding: '0 26px 32px 32px'
      }
    },
    MuiGrid: {
      container: {
        padding: 8
      }
    },
  },
  palette: {
    common: {
      black: '#000',
      white: '#fff'
    },
    error: {
      contrastText: '#fff',
      dark: red[900],
      light: red[500],
      main: red[700]
    },
    primary: {
      contrastText: '#000',
      dark: lightBlue[600],
      light: lightBlue[200],
      main: lightBlue[400],
    },
    secondary: {
      contrastText: '#000',
      dark: lightBlue[800],
      light: lightBlue[400],
      main: lightBlue[600],
    }, 
    type: 'dark'
  },
}

export default theme