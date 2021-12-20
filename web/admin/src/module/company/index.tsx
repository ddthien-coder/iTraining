export * from './WCompany'
export * as hr from './hr'

export enum ContractType {
  FIXED_TERM = "FIXED_TERM", NON_FIXED_TERM = "NON_FIXED_TERM", FREELANCE = "FREELANCE",
  APPRENTICESHIP = "APPRENTICESHIP", PROBATIONARY = "PROBATIONARY"
}

export enum SalaryTypes {
  ANNUAL = "Annual", MONTHLY = "Monthly", HOURLY = "Hourly"
}

export enum ContractStatus {
  ACTIVE = "ACTIVE", DRAFT = "DRAFT", CLOSED = "CLOSED"
}

export enum AllowanceMethod {
  FIXED_AMOUNT = "FIXED_AMOUNT", WORKING_DAY = "WORKING_DAY",
  FULL_SALARY = "FULL_SALARY", INSURANCE_SALARY = "INSURANCE_SALARY"
}

export enum BenefitContributionMethod {
  FIXED_AMOUNT = "FIXED_AMOUNT", FULL_SALARY = "FULL_SALARY", INSURANCE_SALARY = "INSURANCE_SALARY"
}

export enum IncomeTaxDeductionMethod {
  FIXED_AMOUNT = "FIXED_AMOUNT", FULL_SALARY = "FULL_SALARY", INSURANCE_SALARY = "INSURANCE_SALARY"
}

export enum RecruitPlanStatus {
  REQUEST = "REQUEST", REVIEW = "REVIEW", IN_PROGRESS = "IN_PROGRESS", APPROVE = "APPROVE", REJECT = "REJECT",
  DONE = "DONE"
}

export enum RecruitStatus {
  SUBMIT = "SUBMITTED", DENY = "DENIED", ACCEPT = "ACCEPTED"
}

export enum ApplicantStatus {
  APPLIED = "APPLIED", REVIEWED = "REVIEWED", DENNIED = "DENNIED", APPROVED = "APPROVED"
}

export enum ApplicantPhase {
  SOURCE = "SOURCE", OTHER_INFO = "OTHER_INFO", PHONE_INTERVIEW = "PHONE_INTERVIEW",
  FACE_TO_FACE_INTERVIEW = "FACE_TO_FACE_INTERVIEW", NEGOCIATION = "NEGOCIATION"
}

export enum PaidTimeOffType {
  ANNUALTAKEOFF = "AnnualTakeOff", SICKLEAVE = "SickLeave", OTHER = "Other"
}

export enum TimeOffStatus {
  OPEN = "OPEN", PROCESSING = "PROCESSING", APPROVED = "APPROVED", REJECTED = "REJECTED", CANCELLED = "CANCELLED"
}

export enum TimesheetPeriodType {
  MONTHLY = "MONTHLY", HALF_MONTHLY = "HALF_MONTHLY", WEEKLY = "WEEKLY"
}

export enum AdjustmentType {
  WORKING_HOUR = "WORKING_HOUR", OT_HOUR = "OT_HOUR", BONUS = "BONUS", OTHER = "OTHER"
}

export enum AdjustmentStatus {
  REQUEST = "REQUEST", REVIEW = "REVIEW", APPROVE = "APPROVE", REJECT = "REJECT"
}

export enum AdjustmentMethod {
  WORKING_HOUR = "WORKING_HOUR", OT_HOUR = "OT_HOUR", FIXED_AMOUNT = "FIXED_AMOUNT"
};

export enum LoginPermissionOptions {
  EMPLOYEE = 'Employee', PARTNER = 'Partner'
}
