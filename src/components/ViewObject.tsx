import { Button, DialogActions, CardContent, CardHeader, IconButton, Tooltip } from '@material-ui/core'
import { CloseTwoTone } from '@material-ui/icons'
import React, { FC, Fragment, ReactElement } from 'react'

export interface ViewObjectProps {
  title?: string
  obj?: any
  keys?: string[] 
  onClose?: () => void
  disableCloseIcon?: boolean
  disableCloseBtn?: boolean
}

const ViewObject: FC<ViewObjectProps> = ({ title, obj, keys, onClose, disableCloseBtn, disableCloseIcon }): ReactElement => {
  const value: any = {}
  Object.keys(obj || {}).filter(v => typeof obj[v] !== 'object').map(k => value[k] = obj[k])
  const createLabel = (attribute: string, key: number) => {
    return (
      <div key={`obj-view-attribute-${key}`}>
        <strong>{attribute}:</strong> {value[attribute]}
        <br />
        <br />
      </div>
    )
  }
  const viewObj = !!keys ? keys : Object.keys(value || {})
  return (
    <Fragment>
      <CardHeader 
        title={title}
        action={!!onClose && !disableCloseIcon ? (
          <Tooltip title="close">
            <IconButton
              size="small"
              color="primary"
              onClick={onClose}
            >
              <CloseTwoTone />
            </IconButton>
          </Tooltip>
        ) : void 0}
      />
      <CardContent>
        {viewObj.map(createLabel)}
      </CardContent>
      {
        !!onClose && !disableCloseBtn ? (
          <DialogActions>
            <Button
              variant="contained"
              onClick={onClose}
            >
              Close
            </Button>
          </DialogActions>
        ) : void 0
      }
    </Fragment>
  )
}

export default ViewObject