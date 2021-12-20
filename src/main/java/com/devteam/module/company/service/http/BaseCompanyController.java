package com.devteam.module.company.service.http;

import javax.servlet.http.HttpSession;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.ICompany;
import com.devteam.core.module.http.rest.v1.BaseController;
import com.devteam.core.module.http.session.ClientSession;
import com.devteam.module.account.AccountService;
import com.devteam.module.company.core.CompanyService;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.core.security.CompanyAclModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;


import lombok.AllArgsConstructor;
import lombok.Getter;

public class BaseCompanyController extends BaseController {
  final static Logger logger = LoggerFactory.getLogger(BaseCompanyController.class);  
  
  @Autowired
  protected AccountService accountService;
  
  @Autowired
  protected CompanyService service;
  
  
  protected BaseCompanyController(String module, String service) {
    super(module, service);
  }
  
  protected CompanyAclModel doChange(HttpSession session, CompanyAclModel companyAclModel) throws Exception {
    ClientSession clientSession = getAuthorizedClientSession(session);
    Company company = service.getCompany(clientSession.getClientInfo(), companyAclModel.getCompanyCode());
    if(company != null) {
      clientSession.setBean(ICompany.class, company);
      clientSession.setBean(CompanyAclModel.class, companyAclModel);
      return companyAclModel;
    }
    return null;
  }

  protected ClientContext getClientContext(HttpSession session) {
    ClientSession   clientSession = getAuthorizedClientSession(session);
    ClientInfo client        = clientSession.getClientInfo();
    CompanyAclModel context       = clientSession.getBean(CompanyAclModel.class);
    Company         company       = (Company)clientSession.getBean(ICompany.class);
    return new ClientContext(client, context, company);
  }

  
  @AllArgsConstructor @Getter
  static public class ClientContext {
    ClientInfo      clientInfo;
    CompanyAclModel companyContext;
    Company         company;
  }
}