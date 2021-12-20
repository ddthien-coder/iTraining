import { formater } from "components/util/text";
import * as model from './model'
import * as control from './control'
import { FieldConfig } from "./IVGrid";
export * from './WGridRow'
export * from './WGrid'

export { model, control };
export * from './IVGrid'
export * from './util'
export { VGrid } from './VGrid'
export { VGridControlSection, VGridControlManager } from './control/VGridControl'
export * from './VGridEditor'

export const ENTITY_COLUMNS: Array<FieldConfig> = [
  { name: 'modifiedBy', label: 'Modified By', state: { visible: true }, width: 150 },
  {
    name: 'modifiedTime', label: 'Modified Time', state: { visible: true },
    width: 180, format: formater.compactDateTime
  },
  { name: 'storageState', label: 'State', width: 100, state: { visible: false } },

  {
    name: 'companyId', label: 'Company Id', state: { visible: false }, width: 100
  },
  { name: 'createdBy', label: 'Created By', state: { visible: false }, width: 100 },
  {
    name: 'createdTime', label: 'Created Time', state: { visible: false },
    width: 180, format: formater.compactDateTime
  },
  { name: 'editState', label: 'EditState', state: { visible: false }, width: 100 },
]