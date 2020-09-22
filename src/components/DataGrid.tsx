import React, { FC, ReactElement, useState, useEffect, Fragment, useCallback, createContext, useContext } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  TextField,
  MenuItem,
  Menu,
  IconButton,
  Link,
  TablePagination,
  CardHeader,
  CardContent,
} from '@material-ui/core'
import { KeyboardArrowDown } from '@material-ui/icons'
import * as dateFns from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import classnames from 'classnames'

/**
 * TYPES & INTERFACES
 */
export type DataGridColumnFormat = 'date' | 'currency' | 'number' | 'string' | 'boolean' | 'url' | 'img' | 'element'
export type DataGridSorterDir = 'asc' | 'desc' | 'none'
export type DataGridFilterOperator = '=' | '>' | '>=' | '<' | '<=' | '>' | '*='
export interface DataGridColumn {
  title: string
  column: string
  filter?: boolean
  sort?: boolean
  format?: DataGridColumnFormat
}
export interface DataGridSorter {
  dir: DataGridSorterDir
  column: string
}
export interface DataGridFilter {
  value: string
  column: string
  operator: DataGridFilterOperator
}
export interface DataGridState {
  sort: DataGridSorter | {}
  filter: DataGridFilter[] | []
  skip: number,
  take: number
}
export interface DataGridDateFormat {
  timezone: string
  format: string
}

export interface DataGridOptionsColumn {
  align: 'left' | 'right'
  options: FC<any>
}
export interface DataGridProps {
  data: any[]
  total: number
  columns: DataGridColumn[]
  onFilter?: (filters: DataGridFilter[]) => void
  onSort?: (sorter: DataGridSorter) => void
  onSelect?: (selected: any[]) => void
  onClick?: (row: any) => void
  onChange?: (dataState: DataGridState) => void
  onPaginate?: (page: number, rowsPerPage: number) => void
  select?: boolean
  paper?: boolean
  header?: string
  subheader?: string
  headerActions?: ReactElement
  dateFormat?: DataGridDateFormat
  optionsColumn?:DataGridOptionsColumn
}

/**
 * CONSTANTS
 */
const DataGridContext = createContext({
  columns: [],
  filters: [],
  handleFilter: (filter: DataGridFilter) => {},
  handleSorting: (sorter: DataGridSorter) => {},
  onClick: (row: any) => {},
  data: [],
  sorters: [],
  rows: [],
  header: '',
  subheader: '',
  dateFormat: '',
  headerActions: void 0,
  optionsColumn: null,
})
/* eslint-disable */
const testFilter = {
  '*=': (a: any, b: any) => a.includes(b),
  '=': (a: any, b: any) => a == b,
  '>=': (a: any, b: any) => a >= b,
  '>': (a: any, b: any) => a > b,
  '<=': (a: any, b: any) => a <= b,
  '<': (a: any, b: any) => a < b,
}
const l10nUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const l10nEN = new Intl.NumberFormat('en-US')
const formatCurrency = (value: number): string => l10nUSD.format(value)
const formatNumber = (value: number): string => l10nEN.format(value)
const useStyles = makeStyles(theme => ({
  columnTitle: {
    marginTop: theme.spacing(1) / 2,
  },
  th: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  column: {
    minWidth: 120,
  },
  columnHeaderSort: {
    cursor: 'pointer',
  },
  fab: {
    marginRight: theme.spacing(1),
  },
  removeButton: {
    background: theme.palette.error.main,
    color: '#fff',
  },
  sortButton: {
    position: 'relative',
    left: theme.spacing(1),
    top: theme.spacing(1) / 2,
    color: theme.palette.secondary.main,
  },
  sortButtonNone: {
    transform: 'rotate(90deg)',
  },
  sortButtonDesc: {
    transform: 'rotate(180deg)',
  },
  sortButtonAsc: {
    transform: 'rotate(0deg)',
  },
  row: {
    '&:hover': {
      background: theme.palette.background.default,
    }
  },
}))

/**
 * -----------------------------------------------
 * COMPONENT - DataGrid
 * @param props // PROPS
 * -----------------------------------------------
 */
const DataGrid: FC<DataGridProps> = ({
  data,
  total,
  columns,
  onFilter,
  onSort,
  onClick,
  onChange,
  onPaginate,
  // TODO - Select feature
  // onSelect,
  // select,
  paper,
  header,
  subheader,
  headerActions,
  dateFormat = {},
  optionsColumn,
}): ReactElement => {
  const [initDataState, setInitDataState] = useState<boolean>(false)
  const [rows, setRows] = useState<any[]>([])
  const [sorters, setSorters] = useState<DataGridSorter[]>([])
  const [filters, setFilters] = useState<DataGridFilter[]>([])
  // TODO - Select feature
  // const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  
  // Wrap in useCallback to be used inside useEffect
  const handleOnChange = useCallback(!!onChange ? onChange : (dataState: DataGridState) => {}, [])
  const handleOnPaginate = useCallback(!!onPaginate ? onPaginate : (page: number, rowsPerPage: number) => {}, [])

  /**
   * Filtering
   * @param filter
   */
  function handleFilter(filter: DataGridFilter) {
    setPage(0)
    setFilters(prevFilters => {
      const updateFilters = [...prevFilters]
      const updateFilterIndex = updateFilters.findIndex(updateFilter => updateFilter.column === filter.column)
      updateFilters[updateFilterIndex] = filter

      if (onFilter) onFilter(updateFilters.filter(filter => !!filter.value))

      return updateFilters
    })
  }

  /**
   * Sorting
   * @param sorter
   */
  function handleSorting(sorter: DataGridSorter) {
    const updateSorters = [...sorters]
    const updateSorterIndex = updateSorters.findIndex(updateSorter => updateSorter.column === sorter.column)
    const prevSorterActiveIndex = updateSorters.findIndex(prevSorter => prevSorter.dir !== 'none' && prevSorter.column !== sorter.column)
    const updateSortDir: DataGridSorterDir = sorter.dir === 'none' ? 'asc' : sorter.dir === 'asc' ? 'desc' : 'none'
    sorter.dir = updateSortDir

    if (prevSorterActiveIndex > -1) updateSorters[prevSorterActiveIndex].dir = 'none'
    updateSorters[updateSorterIndex] = sorter

    if (onSort) onSort(sorter)
    setPage(0)
    setSorters(updateSorters)
  }

  /**
   * Pagination
   * @param event 
   * @param newPage 
   */
  function handleChangePage(event: unknown, newPage: number) {
    setPage(newPage)
  }

  /**
   * Rows displayed per page
   * @param event 
   */
  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  /**
   * Generate grid rows
   */
  useEffect(() => {
    const columnKeys = columns.map((column: DataGridColumn) => column.column)
    const dataKeys = !!data.length ? Object.keys(data[0]).filter((dataKey: string) => columnKeys.includes(dataKey)) : []
    const rows = !!data.length 
    ? data.map((row: any) => {
      const applicableData: any = {}
      dataKeys.forEach((dataKey: string) => applicableData[dataKey] = row[dataKey])
      if (!!optionsColumn) {
        applicableData.options_zxyw = 't4st'
      }
      // console.log(applicableData)
      return applicableData
    })
    : []
    setRows(rows)
  }, [data, columns, optionsColumn])

  /**
   * Generate filters and sorts
   */
  useEffect(() => {  

    /**
     * Filters
     */
    const filters: DataGridFilter[] = columns
    .filter((column: DataGridColumn): boolean => !!column.filter)
    .map((column: DataGridColumn): DataGridFilter => ({
      value: '',
      column: column.column,
      operator: column.format === 'string' || column.format === 'url' || column.format === 'boolean'
      ? '*='
      : '>'
    }))
    setFilters(filters)

    /**
     * Sorters
     */
    const sorters: DataGridSorter[] = columns
    .filter((column: DataGridColumn): boolean => !!column.sort)
    .map((column: DataGridColumn): DataGridSorter => ({
      dir: 'none',
      column: column.column,
    }))
    setSorters(sorters)

    /**
     * Declare that initial state is set
     */
    setInitDataState(true)
  }, [columns])

  /**
   * Handle pagination
   */
  useEffect(() => {
    if (handleOnPaginate) handleOnPaginate(page, rowsPerPage)
  }, [page, rowsPerPage, handleOnPaginate])

  const provider: any = {
    columns,
    filters,
    handleFilter,
    handleSorting,
    sorters,
    rows,
    onClick,
    header,
    subheader,
    dateFormat,
    headerActions,
    data,
    optionsColumn,
  }

  /**
   * Generate dataState
   */
  useEffect(() => {
    if (initDataState) {
      const dataState: DataGridState = {
        filter: filters.filter(filter => !!filter.value),
        sort: sorters.find(sorter => sorter.dir !== 'none') || {},
        skip: page * rowsPerPage,
        take: rowsPerPage,
      }
  
      handleOnChange(dataState)
    }
  }, [page, rowsPerPage, filters, sorters, handleOnChange, initDataState])

  return (
    <DataGridContext.Provider value={provider}>
      <Header />
      <CardContent>
        <EnhandedTableContainer paper={paper}>
          <Columns />
          <Rows />
        </EnhandedTableContainer>
      </CardContent>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </DataGridContext.Provider>
  )
}

function EnhandedTableContainer ({ children, paper }: { children: ReactElement[] | ReactElement, paper?: boolean }) {
  if (!!paper) {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="client list" size="small">{children}</Table>
      </TableContainer>
    )
  }
  return <TableContainer><Table aria-label="client list" size="small">{children}</Table></TableContainer>
}

interface FilterInputProps {
  filter: DataGridFilter
  format: DataGridColumnFormat
  onChange: (fitler: DataGridFilter) => void
}

/**
 * -----------------------------------------------
 * COMPONENT - FilterInput
 * @param props 
 * -----------------------------------------------
 */
function FilterInput({ filter, format, onChange }: FilterInputProps): ReactElement {
  const { column, operator } = filter
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open: boolean = !!anchorEl
  const handleToggleOpen = (event: React.MouseEvent<HTMLElement>): void => {
    const { currentTarget } = event
    setAnchorEl(previousAnchorEl => !previousAnchorEl ? currentTarget : null)
  }
  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, operator: DataGridFilterOperator): void => {
    const updateFilter: DataGridFilter = { ...filter, operator }
    onChange(updateFilter)
    handleToggleOpen(event)
  }
  const Text = () => (
    <Fragment>
      <MenuItem 
        selected={'*=' === operator}
        onClick={(event: React.MouseEvent<HTMLElement>) => handleMenuItemClick(event, '*=')}
      >
        {'*='}
      </MenuItem>
      <MenuItem 
        selected={'=' === operator}          
        onClick={(event: React.MouseEvent<HTMLElement>) => handleMenuItemClick(event, '=')}
      >
        {'='}
      </MenuItem>
    </Fragment>
  )
  const Numb = () => (
    <Fragment>
      <MenuItem 
        selected={'>' === operator}
        onClick={(event: React.MouseEvent<HTMLElement>) => handleMenuItemClick(event, '>')}
      >
        {'>'}
      </MenuItem>
      <MenuItem 
        selected={'=' === operator}          
        onClick={(event: React.MouseEvent<HTMLElement>) => handleMenuItemClick(event, '=')}
      >
        {'='}
      </MenuItem>
      <MenuItem 
        selected={'<' === operator}          
        onClick={(event: React.MouseEvent<HTMLElement>) => handleMenuItemClick(event, '<')}
      >
        {'<'}
      </MenuItem>
    </Fragment>
  )
  const isText = format === 'string' || format === 'url' || format === 'boolean'

  return (
    <Fragment>
      <IconButton
        aria-controls={`filter-operators-${column}`}
        aria-label="filter options"
        aria-haspopup="true"
        onClick={handleToggleOpen}
        color="primary"
        style={{position: 'relative', right: 20, top: 14, width: 34, height: 34}}
        size="small"
      >
        {operator}
      </IconButton>
      <Menu
        id={`filter-operators-${column}`}
        open={open}
        anchorEl={anchorEl}
        onClose={handleToggleOpen}
      >
        {isText ? <Text /> : <Numb />}
      </Menu>
    </Fragment>
  )
}

/**
 * -----------------------------------------------
 * COMPONENT - Columns
 * -----------------------------------------------
 */
function Columns(): ReactElement {
  const { filters, columns, sorters, optionsColumn }: any = useContext(DataGridContext)
  const classes = useStyles()
  const newOptionsColumn: DataGridColumn = {
    column: 'options_zxyw',
    title: 'Options',
    format: 'element',
  }
  function createColumn(column: DataGridColumn, key: number) {
    const filter: DataGridFilter | undefined = column.filter ? filters.find((filter: DataGridFilter): boolean => filter.column === column.column) : void 0
    const sorter = !!column.sort ? sorters.find((sorter: DataGridSorter) => sorter.column === column.column) : void 0
    return (
      <TableCell 
        key={`grid-data-column-${key}`}
        className={classnames(classes.th, classes.column)}
        align={key === 0 ? 'left' : key === columns.length - 1 ? 'right' : 'center'}
      >
        <Sorter sorter={sorter} columnTitle={column.title} />
        <Filter key={`test-${key}`} filter={filter} format={column.format || 'string'} />
      </TableCell>
    )
  }
  return (
    <TableHead>
      <TableRow style={{verticalAlign: 'top'}}>
        {optionsColumn?.align === 'left' ? createColumn(newOptionsColumn, 0) : void 0}
        {columns.map(createColumn)}
        {optionsColumn?.align === 'right' ? createColumn(newOptionsColumn, 0) : void 0}
      </TableRow>
    </TableHead>
  )
}

export interface SorterProps {
  sorter?: DataGridSorter
  columnTitle: string
}

function Sorter({ sorter, columnTitle }: SorterProps) {
  const { handleSorting } = useContext(DataGridContext)
  const classes = useStyles()

  if (!!sorter) {
    const sortClass: 'sortButtonNone' | 'sortButtonAsc' | 'sortButtonDesc' = sorter.dir === 'asc' ? 'sortButtonAsc' : sorter.dir === 'desc' ? 'sortButtonDesc' : 'sortButtonNone'
    return (
      <div className={classes.columnHeaderSort} onClick={() => handleSorting(sorter)}>
        {columnTitle} {<KeyboardArrowDown className={classnames(classes.sortButton, classes[sortClass])} fontSize="small" />}
      </div>
    )
  }

  return <div className={classes.columnTitle}>{columnTitle}</div>
}

/**
 * -----------------------------------------------
 * COMPONENT - Filter
 * @param props
 * -----------------------------------------------
 */
function Filter({ filter, format }: { filter?: DataGridFilter, format: DataGridColumnFormat }): ReactElement | null {
  const { handleFilter } = useContext(DataGridContext)
  if (!!filter) {
    const { column, value } = filter
    const handleTextField = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      filter.value = event.target.value
      handleFilter(filter)
    }
    return (
      <Fragment>
        <TextField
          name={`grid-filter-${column}`}
          label="Filter"
          value={value}
          onChange={handleTextField}
          fullWidth
        />
        <FilterInput filter={filter} onChange={handleFilter} format={format} />
      </Fragment> 
    )
  }
  return null
}

/**
 * -----------------------------------------------
 * COMPONENT - Rows
 * -----------------------------------------------
 */
function Rows(): ReactElement {
  const { data, rows, columns, onClick, dateFormat, optionsColumn }: any = useContext(DataGridContext)
  const classes = useStyles()

  function createRow(row: any, key: number) {
    const columnKeys = columns.map((column: DataGridColumn) => column.column)
    const cells = columnKeys.map((columnKey: string, keyIteration: number) => createCell(row[columnKey], columns[keyIteration].format || 'string', key, keyIteration))
    const createElementCell = (align: 'right' | 'left') => optionsColumn?.align === align ? createCell(optionsColumn.options, 'element', key, 999) : void 0
    return (
      <TableRow 
        key={`grid-data-row-${key}`} 
        className={classes.row}
        style={!!onClick ? { cursor: 'pointer' } : void 0}
        onClick={!!onClick ? () => onClick(data[key]) : void 0}
      >
        {createElementCell('left') }
        {cells}
        {createElementCell('right')}
      </TableRow>
    )
  }

  function createCell(cellData: any, format: DataGridColumnFormat, rowKey: number, cellKey: number) {
    const cell = format === 'boolean' 
    ? cellData.toString()
    : format === 'number'
    ? formatNumber(Number(cellData))
    : format === 'date' && !!cellData && dateFormat
    ? dateFns.format(dateFormat.timezone ? zonedTimeToUtc(new Date(cellData), dateFormat.timezone) : new Date(cellData),dateFormat.format || `MM'/'dd'/'yyyy`)
    : format === 'currency'
    ? formatCurrency(Number(cellData))
    : format === 'url'
    ? <Link href={cellData} target="_blank" color="secondary">{cellData}</Link>
    : format === 'element'
    ? <div style={{ textAlign: optionsColumn?.align === 'right' ? 'right' : 'left'}}>{React.createElement(cellData, { data: data[rowKey], key: rowKey })}</div>
    : cellData
    
    return (
      <TableCell 
        key={`grid-data-cell-${rowKey}-${cellKey}`}
        className={classes.th}
        align={cellKey === 0 ? 'left' : cellKey === columns.length - 1 ? 'right' : 'center'}
      >
        {cell}
      </TableCell>
    )
  }

  return (
    <TableBody>{rows.map(createRow)}</TableBody>)
}

/**
 * -----------------------------------------------
 * COMPONENT - Header
 * -----------------------------------------------
 */
function Header(): ReactElement | null {
  const { header, subheader, headerActions } = useContext(DataGridContext)
  if (!!header) {
    return (
      <CardHeader
        title={header}
        subheader={subheader}
        action={headerActions} 
      />
    )
  }
  return null
}

export function handleGridDataState(data: any[], columns: DataGridColumn[], dataState?: any): unknown[] {
  
  let gridData: unknown[] = []
  
  if (!!dataState && dataState) {
    const { filter = [], sort = { dir: 'none', column: ''}, skip, take } = dataState
    gridData = data

    // Filtering
    .filter((item: any) => {
      const filterColumns = filter.map((filter: DataGridFilter) => filter.column)
      let doesItemStay: boolean = true
      filterColumns.forEach((filterColumn: string) => {
        if (doesItemStay) {
          const isDate = !!columns
            .filter((column: DataGridColumn) => column.format === 'date')
            .find((column: DataGridColumn) => column.column === filterColumn)
          const appliedFilter: DataGridFilter = filter.find((filter: DataGridFilter) => filter.column === filterColumn)
          const value = isDate ? new Date(item[filterColumn]).getUTCDate() : item[filterColumn]
          const testValue = isDate ? new Date(appliedFilter.value).getUTCDate() : appliedFilter.value
          doesItemStay = testFilter[appliedFilter.operator](value, testValue)  
        }
      })
      return doesItemStay
    })

    // Sorting
    .sort((a: any, b: any) => {
      const columnDateKeys = columns.filter(column => column.format === 'date').map(column => column.column)
      const isDate = columnDateKeys.includes(sort.column)
      const aValue = isDate ? new Date(a[sort.column]) : a[sort.column]
      const bValue = isDate ? new Date(b[sort.column]) : b[sort.column]

      return sort.dir === 'asc' 
        ? aValue > bValue ? 1 : -1
        : sort.dir === 'desc'
        ? aValue < bValue ? 1 : -1
        : a 
    })

    // Pagination
    .filter((item: unknown, key: number) => key >= skip && key < skip + take)

  }

  return gridData
}

export default DataGrid