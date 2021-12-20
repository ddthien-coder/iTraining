export * from './WAccount'
export * from './UINewAccount'
export * from './WAvatar'
export { UIAccountLinkPlugin } from './UIAccountLinkPlugin'

export enum AccountType {
  USER = 'USER', ORGANIZATION = 'ORGANIZATION'
}

export enum UserIdentityType {
  ID = "ID", PASSPORT = "PASSPORT", TAX_CODE = "TAX_CODE"
}

export enum Certificate {
  ASSOCIATE = "THE DEGRRE OF ASOCIATE",
  BACHELOR = "THE DEGREE OF BACHELOR",
  ENGINEER = "THE DEGREE OF ENGINEER",
  MASTER = "THE DEGREE OF MASTER",
  DOCTOR_PHILOSOPHY = "THE DEGREE OF DOCTOR PHILOSOPHY"
}

export enum Organization {
  DOLPHIN = "DOLPHIN LOGICTIC",
  OF1 = "OPEN FREIGHT ONE"
}