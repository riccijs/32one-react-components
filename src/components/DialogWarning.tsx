import React, { FC, ReactElement } from 'react'
import { Dialog, CardHeader, DialogActions, Button, Tooltip, IconButton } from '@material-ui/core'
import { CloseTwoTone } from '@material-ui/icons'

export interface DialogWarningProps {
  open: boolean
  warning: string
  message: string
  onProceed: () => void
  onCancel: () => void
}

const DialogWarning: FC<DialogWarningProps> = ({ open, warning, message, onCancel, onProceed }): ReactElement => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      style={{minWidth: 375}}
    >
      <CardHeader 
        title={warning} 
        subheader={message} 
        action={(
          <Tooltip title="Close">
            <IconButton
              size="small"
              color="primary"
              onClick={onCancel}
            >
              <CloseTwoTone />
            </IconButton>
          </Tooltip>
        )}
      />
      <DialogActions>
        <Button
          variant="contained"
          onClick={onCancel}
          autoFocus
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onProceed}
        >
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogWarning