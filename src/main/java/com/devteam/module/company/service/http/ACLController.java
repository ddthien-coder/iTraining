package com.devteam.module.company.service.http;

import java.util.List;
import java.util.concurrent.Callable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.ICompany;
import com.devteam.core.module.http.rest.RestResponse;
import com.devteam.core.module.http.rest.v1.AuthenticationService;
import com.devteam.core.module.http.session.ClientSession;
import com.devteam.core.module.security.SecurityService;
import com.devteam.core.module.security.entity.AccessToken;
import com.devteam.core.module.security.entity.AccessType;
import com.devteam.core.module.security.entity.AppAccessPermission;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.core.security.ACLModel;
import com.devteam.module.company.core.security.CompanyAclModel;
import com.devteam.module.company.service.hr.HRService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;


@ConditionalOnBean(AuthenticationService.class)
@Api(value="devteam", tags= {"acl"})
@RestController
@RequestMapping("/rest/v1.0.0/acl")
@Slf4j
public class ACLController extends BaseCompanyController {
  @Getter @Setter
  static public class LoginModel {
    private String tenantId;
    private String companyCode;
    private String loginId;
    private String password;
    private int    timeToLiveInMin;
    private AccessType accessType = AccessType.Employee;
  }
  
  @Autowired
  protected HRService hrService;

  @Autowired
  protected SecurityService securityService;
  
  public ACLController() {
    super("acl", "/acl");
  }
  
  @ApiOperation(value = "Account ACL aunthenticate", response = ACLModel.class)
  @PostMapping("authenticate")
  public @ResponseBody RestResponse authenticate(HttpServletRequest httpReq, @RequestBody LoginModel model) throws Exception {
    Callable<ACLModel> executor = () -> {
      HttpSession session = httpReq.getSession(true);
      String      loginId = model.getLoginId();
      ClientInfo client = new ClientInfo(model.getTenantId(), loginId, httpReq.getRemoteAddr(), session.getId());
      AccessToken token = accountService.authenticate(client, loginId, model.getPassword(), 24 * 60);
      ACLModel accountAcl = new ACLModel(token);
      return doLogin(session, client, accountAcl);
    };
    return execute(Method.POST, "authenticate", executor);
  }

  @ApiOperation(value = "Account ACL aunthenticate", response = ACLModel.class)
  @PostMapping("token/validate")
  public @ResponseBody RestResponse validate(HttpServletRequest httpReq, @RequestBody AccessToken token) throws Exception {
    Callable<ACLModel> executor = () -> {
      HttpSession session = httpReq.getSession(true);
      ClientInfo client = new ClientInfo("default", "system", httpReq.getRemoteAddr(), session.getId());
      AccessToken accessToken = securityService.validateAccessToken(client, token.getToken());
      ACLModel accountAcl = new ACLModel(accessToken);
      return doLogin(session, client, accountAcl);
    };
    return execute(Method.POST, "token/validate", executor);
  }
  
  @ApiOperation(value = "Account ACL logout", response = Boolean.class)
  @GetMapping("logout")
  public @ResponseBody RestResponse logout(HttpSession session) throws Exception {
    Callable<Boolean> executor = () -> {
      ClientSession authSession = doLogout(session);
      return authSession != null;
    };
    return execute(Method.GET, "logout", executor);
  }
  
  protected ACLModel doLogin(HttpSession session, ClientInfo client, ACLModel accountAcl) throws Exception {
    String loginId = accountAcl.getAccessToken().getLoginId();
    client.setRemoteUser(loginId);
    if(accountAcl.getAccessToken().isAuthorized()) {
      ClientSession clientSession = doLogin(session, client);
      List<CompanyAclModel> contexts = hrService.findCompanyAcls(client, loginId);
      accountAcl.withAvailableCompanyAcls(contexts);
      CompanyAclModel companyAcl = accountAcl.getCompanyAcl();
      if(companyAcl != null) {
        Company company = service.getCompany(client, companyAcl.getCompanyCode());
        List<AppAccessPermission> appPermissions =
            securityService.findPermissions(client, company.getId(), AccessType.Employee, companyAcl.getLoginId());

        companyAcl.setAppPermissions(appPermissions);
        clientSession.setBean(ICompany.class, company);
        clientSession.setBean(CompanyAclModel.class, companyAcl);
      }

      accountAcl.setSessionId(session.getId());
      log.info("User {} is logged in successfully into {} tenant system", loginId, client.getClientId());
    } else {
      log.info("User {} try to login into {} tenant system, but fail", loginId, client.getTenantId());
    }
    return accountAcl;
  }

  @ApiOperation(value = "Change Company Context", response = CompanyAclModel.class)
  @PostMapping("change")
  public @ResponseBody RestResponse changeCompany(HttpSession session, @RequestBody CompanyAclModel ctx) throws Exception {
    Callable<CompanyAclModel> executor = () -> {
      return doChange(session, ctx);
    };
    return execute(Method.POST, "change", executor);
  }
}