import { EntityUtil } from "core/entity";

export function createEmployeeWorkTerm(workTerm: any) {
  let employeeWorkTerm = {
    label: workTerm.label,
    category: workTerm.category,
    term: workTerm.term,
    workTerm: workTerm
  }
  return employeeWorkTerm;
}

export function createEmployeeWorkContractTerm(workContractTerm: any) {
  let employeeWorkContractTerm = {
    label: workContractTerm.label,
    category: workContractTerm.category,
    term: workContractTerm.term,
    workContractTerm: workContractTerm
  }
  return employeeWorkContractTerm;
}

export function createEmployeeAllowance(allowance: any) {
  let employeeAllowance = {
    category: allowance.category,
    code: allowance.code,
    label: allowance.label,
    description: allowance.description,
    amount: allowance.amount,
    currency: allowance.currency,
    unit: allowance.unit
  }
  return employeeAllowance;
}

export function cloneWorkPositionContract(workPositionContract: any) {
  if (!workPositionContract) return null;
  let clone = EntityUtil.clone(workPositionContract, true);
  EntityUtil.clearIds(clone.allowances);
  EntityUtil.clearIds(clone.terms);
  EntityUtil.clearIds(clone.benefitContributions);
  EntityUtil.clearIds(clone.incomeTaxDeductions);

  clone.label = "";
  return clone;
}