import React, { ChangeEvent } from 'react'
import { makeStyles, TextField, InputAdornment } from '@material-ui/core'
import { SearchTwoTone } from '@material-ui/icons'

export interface SearchFieldProps {
  onChange: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  className?: string
}

const useStyles = makeStyles(theme => ({
  input: {
    borderRadius: theme.spacing(6)
  }
}))

const SearchField = ({ onChange, className }: SearchFieldProps) => {
  const classes = useStyles()
  const inputProps = {
    endAdornment: (
      <InputAdornment position="end">
        <SearchTwoTone fontSize="small"/>
      </InputAdornment>
    ),
    className: classes.input,
    disableUnderline: true,
  }
  return (
    <TextField
      label="Search"
      size="small"
      variant="filled"
      className={className}
      InputProps={inputProps}
      onChange={onChange}
      fullWidth
    />
  )
}

export default SearchField