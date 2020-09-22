import React, { FC, ReactElement, Fragment } from 'react'
import { Tooltip, IconButton } from '@material-ui/core'
import { EditTwoTone, VisibilityTwoTone, DeleteForeverTwoTone } from '@material-ui/icons'

export interface DataGridRecordOptionsProps {

  onView: (data?: any) => void
  onEdit: (data?: any) => void
  onDelete: (date?: any) => void
  data: any
}
const DataGridRecordOptions: FC<DataGridRecordOptionsProps> = ({ onView, onDelete, onEdit, data}): ReactElement => {
  return (
    <Fragment>
      <Tooltip title="Edit">
        <IconButton onClick={() => onEdit(data)}>
          <EditTwoTone />
        </IconButton>
      </Tooltip>
      <Tooltip title="View">
        <IconButton onClick={() => onView(data)}>
          <VisibilityTwoTone />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton onClick={() => onDelete(data)}>
          <DeleteForeverTwoTone />
        </IconButton>
      </Tooltip>
    </Fragment>
  )
}

export default DataGridRecordOptions