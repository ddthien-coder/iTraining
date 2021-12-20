package com.devteam.module.company.core.data;

import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.JPAService;
import com.devteam.core.module.data.db.sample.PersistableEntityAssert;
import com.devteam.core.module.data.db.sample.SampleData;
import com.devteam.core.util.ds.Arrays;
import com.devteam.core.util.text.DateUtil;
import com.devteam.module.company.core.CompanyService;
import com.devteam.module.company.core.entity.Company;
import org.springframework.beans.factory.annotation.Autowired;


public class CompanyData  extends SampleData {
  static final public String DEFAULT_COMPANY_CODE = "default";
  final static public String TEST_COMPANY_CODE = "test";
  final static public String DEMO_COMPANY_CODE = "demo";

  @Autowired
  CompanyService service;

  @Autowired
  private JPAService jpaService;

  public Company TEST_COMPANY ;

  public Company DEMO_COMPANY ;
  
  protected void initialize(ClientInfo client) {
    Company companyDefault = service.getCompany(client, DEFAULT_COMPANY_CODE);
    TEST_COMPANY =
        new Company(TEST_COMPANY_CODE, "IT Company Inc")
            .withLoginAccountLoginId("admin")
            .withFullName("IT Company")
            .withDescription("IT Company")
            .withRegistrationCode("0337303666").withFoundingDate(DateUtil.parseCompactDate("12/08/2010"))
            .withParent(companyDefault);

    DEMO_COMPANY =
        new Company(DEMO_COMPANY_CODE, "Demo Company Inc")
            .withLoginAccountLoginId("admin")
            .withFullName("Demo Company")
            .withDescription("Demo Company")
            .withRegistrationCode("0337303666")
            .withFoundingDate(DateUtil.parseCompactDate("12/08/2010"))
            .withParent(companyDefault);
    
    Arrays.asList(TEST_COMPANY, DEMO_COMPANY).forEach(company -> {
      createCompany(client, company);
    });
  }

  void createCompany(ClientInfo client, Company company) {
    service.createCompany(client, company);
    jpaService.getEntityManager().flush();
  }
  
  public void assertAll(ClientInfo client) throws Exception {
    new CompanyAssert(client, TEST_COMPANY)
    .assertEntityCreated()
    .assertEntityUpdate()
    .assertEntitySearch();
  }

  public class CompanyAssert extends PersistableEntityAssert<Company> {

    public CompanyAssert(ClientInfo client, Company company) throws Exception {
      super(client, company);
      this.methods = new EntityServiceMethods() {
        public Company load() {
          return service.getCompany(client, entity.getCode());
        }

        public Company save(Company com) {
          service.saveCompany(client, com);
          return load();
        }

        public List<?> searchEntity() {
          return service.searchCompanies(client, createSearchQuery(company.getCode()));
        }
      };
    }
  }
}
