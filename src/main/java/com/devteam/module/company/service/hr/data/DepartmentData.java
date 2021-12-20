package com.devteam.module.company.service.hr.data;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.sample.EntityDB;
import com.devteam.core.util.ds.AssertTool;
import com.devteam.module.company.core.data.CompanyData;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.service.hr.entity.HRDepartment;

import java.util.List;

public class DepartmentData extends DBModuleDataAssert {
  public Company COMPANY = EntityDB.getInstance().getData(CompanyData.class).TEST_COMPANY;

  public HRDepartment IT;
  public HRDepartment IT_DEVELOPER;

  public HRDepartment HR;
  
  public HRDepartment ACCOUNTING ;


  public HRDepartment[] ALL;

  protected void initialize(ClientInfo client, Company company) {
    IT = 
        new HRDepartmentBuilder("it", "IT", "IT Department").
        create(client, company);

    IT_DEVELOPER = 
        new HRDepartmentBuilder("it/developer", "IT Developer", "IT Developer Department").
        withParent(IT).
        create(client, company);

    HR = new HRDepartmentBuilder("hr", "HR", "HR Department").create(client, company);

    ACCOUNTING = 
        new HRDepartmentBuilder("accounting", "Accounting", "Accounting Department").
        create(client, company);



    ALL = new HRDepartment[] {
        IT, IT_DEVELOPER,
        HR, ACCOUNTING
    };
  }

  public class HRDepartmentBuilder {
    Company company;
    HRDepartment parent;
    HRDepartment department ;


    public HRDepartmentBuilder(String name, String label, String desc) {
      this.department = new HRDepartment(name, label, desc);
    }

    public HRDepartmentBuilder withParent(HRDepartment parent) {
      this.parent = parent;
      return this;
    }

    public HRDepartment getHRDepartment() { return department; }

    HRDepartment create(ClientInfo client, Company company) {
      department = hrService.createHRDepartment(client, company, parent, department);
      return department;
    }
  }
  
  public void assertCompanyHRDepartment() {
    new CompanyHrDepartmentAssert(client, company, IT)
    .assertEntityCreated()
    .assertLoad((origin, entity) -> {
      AssertTool.assertNotNull(entity.getName());
      List<HRDepartment> childDepartments = hrService.findHRDepartmentChildren(client, company, entity.getParentId());
      AssertTool.assertInCollection(entity, childDepartments);
    })
    .assertEntityUpdate();
  }
}