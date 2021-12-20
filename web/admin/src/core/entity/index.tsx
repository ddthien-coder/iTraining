export * from './BeanObserver'
export * from './utilities'

export enum StorageState {
  CREATED = 'CREATED', INACTIVE = 'INACTIVE', JUNK = 'JUNK',
  DEPRECATED = 'DEPRECATED', ACTIVE = 'ACTIVE', ARCHIVED = 'ARCHIVED'
}

export enum EditMode {
  DRAFT = 'DRAFT', VALIDATED = 'VALIDATED', LOCKED = 'LOCKED'
}

export enum ShareableScope {
  PRIVATE = "PRIVATE",
  COMPANY = "COMPANY",
  ORGANIZATION = "ORGANIZATION",
  DESCENDANTS = "DESCENDANTS"
}

export enum ModifyBeanActions {
  CREATE = 'create',
  MODIFY = 'modify',
  DELETE = 'delete'
}

export enum ExplorerActions {
  ADD = 'add',
  EDIT = 'edit',
  DEL = 'del'
}
