export interface Field { field: string, alias?: string }

export interface Table { table: string, alias?: string }

export interface Filter {
  required?: boolean, label?: string, name: string, type: string, filterValue?: string
}

export interface OptionFilter {
  required?: boolean,
  label?: string, name: string, type: string,
  options: Array<string>,
  optionLabels?: Array<string>,
  selectOption?: string
}

export interface RangeFilter {
  required?: boolean, label?: string, name: string, type: string, fromValue?: null | string, toValue?: null | string
}

export interface OrderBy {
  fields: Array<string>,
  fieldLabels?: Array<string>,
  selectFields?: Array<string>,
  sort?: string
}

export interface SqlSearchParams {
  /**@deprecated */
  optionalSqlParams?: any,
  /**@deprecated */
  optionalParams?: any,
  params?: any,
  filters?: Array<Filter>,
  optionFilters?: Array<OptionFilter>,
  rangeFilters?: Array<RangeFilter>,
  orderBy?: OrderBy,
  maxReturn: number
}
