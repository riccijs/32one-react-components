import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import React, { FC } from 'react'

interface AutocompleteSelectorProps {
  options: any[]
  optionsLabel: string
  selected: any[] | any
  onSelect: (event: any, option: any) => void
  textFieldLabel?: string
  multiple?: boolean
  required?: boolean
}

const AutocompleteSelector: FC<AutocompleteSelectorProps> = ({ options, optionsLabel, selected, onSelect, textFieldLabel, multiple, required }) => {
  return (
    <Autocomplete
      id={`autocomplete`}
      options={options}
      getOptionLabel={(option) => option[optionsLabel]}
      value={selected}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label={textFieldLabel}
          required={required}
        />
      )}
      onChange={onSelect}
      multiple={multiple}
      fullWidth
    />
  )
}

export default AutocompleteSelector
