import { VGridEntityListPlugin } from 'core/widget/vgrid';

export class HRDepartmentExplorerPlugin extends VGridEntityListPlugin {
  createDepartmentOptionalParams() {
    return { "department": null };
  }

  onSelectDepartment(departmentId: string | null) {
    if (this.searchParams) {
      this.searchParams.params = { 'departmentId': departmentId };
    }
    return this;
  }
}

export const HRRestURL = {
  employee: {
    load: (loginId: string) => { return `/company/hr/employee/${loginId}` },
    save: "/company/hr/employee",
    create: "/company/hr/employee/create",
    search: "/company/hr/employee/search",
    saveState: "/company/hr/employees/storage-state"
  },

  department: {
    load: (id: string) => { return `/company/hr/department/${id}` },
    loadChildren: (deptId?: number) => {
      if (!deptId) deptId = 0;
      return `/company/hr/department/${deptId}/children`;
    },
    save: "/company/hr/department",
    relation: (departmentId: number) => { return `/company/hr/department/${departmentId}/relations` },
    search: "/company/hr/department/search",
    delete: (id: number) => { return `/company/hr/department/${id}` }
  },
};

export const HRWorkRestURL = {
  position: {
    load: (code: string) => { return `/company/hr/work/position/${code}` },
    save: "/company/hr/work/position",
    create: "/company/hr/work/position",
    search: "/company/hr/work/position/search",
    saveState: "/company/hr/work/position/storage-state"
  },

  contract: {
    load: (code: string) => { return `/company/hr/work/contract/${code}` },
    save: "/company/hr/work/contract",
    search: "/company/hr/work/contract/search",
    saveState: "/company/hr/work/contract/storage-state",
    saveAttachments: (contractId: number) => { return `/company/hr/work/contract/${contractId}/attachments`; },
    loadAttachments: (contractId: number) => { return `/company/hr/work/contract/${contractId}/attachments`; }
  },

  workPositionContract: {
    load: (code: string) => { return `/company/hr/work/position/contract/${code}` },
    save: "/company/hr/work/position/contract",
    search: "/company/hr/work/position/contract/search",
    saveState: "/company/hr/work/position/contract/storage-state"
  },

  contractTerm: {
    load: (id: string) => { return `/company/hr/work/contract/term/${id}` },
    save: "/company/hr/work/contract/term",
    search: "/company/hr/work/contract/term/search",
    saveState: "/company/hr/work/contract/term/storage-state"
  },

  taxDeductionType: {
    load: (type: string) => { return `/company/hr/work/tax-deduction-type/${type}` },
    save: "/company/hr/work/tax-deduction-type",
    search: "/company/hr/work/tax-deduction-type/search",
    saveState: "/company/hr/work/tax-deduction-type/storage-state"
  },

  WorkAllowance: {
    loadall: (code: string) => { return `/company/hr/work/allowance/${code}`; },
    search: "/company/hr/work/allowance/search",
    save: "/company/hr/work/allowance",
    saveState: "/company/hr/work/allowance/storage-state",
  },

  workTerm: {
    load: (id: string) => { return `/company/hr/work/term/${id}` },
    save: "/company/hr/work/term",
    search: "/company/hr/work/term/search",
    saveState: "/company/hr/work/term/storage-state"
  },
};

export const HRSalaryCalculatorURL = {
  salary: {
    load: (code: string) => { return `/company/misc/salary/${code}` },
    save: "/company/misc/salary",
    search: "/company/misc/salary/search",
  },
}