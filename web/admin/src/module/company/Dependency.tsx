import { i18n } from 'components'

export * from './RestURL'
export * from '../company';

export * from 'core/entity'

export { UIEmployeeListEditor, BBEmployeeAutoComplete } from '../company/hr';

export { BBAccountAutoComplete } from '../account/WAccount';

export * from "module/company/RestURL";

export const T = i18n.getT(['module.company']);
