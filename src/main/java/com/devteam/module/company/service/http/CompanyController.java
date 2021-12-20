package com.devteam.module.company.service.http;

import java.util.List;
import java.util.concurrent.Callable;

import javax.servlet.http.HttpSession;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.query.SqlQueryParams;
import com.devteam.core.module.http.rest.RestResponse;
import com.devteam.core.module.http.rest.v1.AuthenticationService;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.core.entity.CompanyConfig;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;



@ConditionalOnBean(AuthenticationService.class)
@Api(value="devteam", tags= {"company"})
@RestController
@RequestMapping("/rest/v1.0.0/company")
public class CompanyController extends BaseCompanyController {
  
  protected CompanyController() {
    super("company", "/company");
  }
  
  @ApiOperation(value = "Get Companies By code", response = Company.class)
  @GetMapping("{code}")
  public @ResponseBody RestResponse getSeaTransportChargeByCode(HttpSession session, @PathVariable("code") String code) {
    Callable<Company> executor = () -> {
      BaseCompanyController.ClientContext ctx = getClientContext(session);
      Company companyInDb =  service.getCompany(ctx.getClientInfo(), code);
      return companyInDb;
    };
    return execute(Method.GET, "{code}", executor);
  }
  
  @ApiOperation(value = "Get Companies By id", response = Company.class)
  @GetMapping("id/{id}")
  public @ResponseBody RestResponse getCompanyById(HttpSession session, @PathVariable("id") Long id) {
    Callable<Company> executor = () -> {
      BaseCompanyController.ClientContext ctx = getClientContext(session);
      Company companyInDb =  service.getCompany(ctx.getClientInfo(), id);
      return companyInDb;
    };
    return execute(Method.GET, "id/{id}", executor);
  }
  
  @ApiOperation(value = "Search Companies", responseContainer = "List", response = Company.class)
  @PostMapping("search")
  public @ResponseBody RestResponse  searchCompanies(HttpSession session, @RequestBody SqlQueryParams params) {
    Callable<List<Company>> executor = () -> {
      return service.searchCompanies(getAuthorizedClientInfo(session), params);
    };
    return execute(Method.POST, "search", executor);
  }
  
  @ApiOperation(value = "Save the Company", response = Company.class)
  @PutMapping("update")
  public @ResponseBody RestResponse saveCompany(HttpSession session, @RequestBody Company company) {
    Callable<Company> executor = () -> {
      if(company == null) return null;
      Company updatedCompany = service.saveCompany(getAuthorizedClientInfo(session), company);
      return updatedCompany;
    };
    return execute(Method.PUT, "update", executor);
  }
  
  @ApiOperation(value = "Save the Company", response = Company.class)
  @PutMapping("create")
  public @ResponseBody RestResponse createCompany(HttpSession session, @RequestBody Company company) {
    Callable<Company> executor = () -> {
      if(company == null) return null;
      Company updatedCompany = service.createCompany(getAuthorizedClientInfo(session), company);
      return updatedCompany;
    };
    return execute(Method.PUT, "create", executor);
  }
  
  //CompanyConfig
  @ApiOperation(value = "Get Company Config By Company Id", response = Company.class)
  @GetMapping("config/id/{id}")
  public @ResponseBody RestResponse getCompanyConfigById(HttpSession session, @PathVariable("id") Long id) {
    Callable<CompanyConfig> executor = () -> {
      BaseCompanyController.ClientContext ctx = getClientContext(session);
      return service.getCompanyConfig(ctx.getClientInfo(), id);
    };
    return execute(Method.GET, "config/id/{id}", executor);
  }

  @ApiOperation(value = "Save Company Config", response = CompanyConfig.class)
  @PutMapping("config/save")
  public @ResponseBody RestResponse saveServiceLocaiton(HttpSession session, @RequestBody CompanyConfig companyConfig) {
    Callable<CompanyConfig> executor = () -> {
      BaseCompanyController.ClientContext ctx = getClientContext(session);
      ClientInfo client = ctx.getClientInfo();
      return service.saveCompanyConfig(client, ctx.getCompany(), companyConfig);
    };
    return execute(Method.PUT, "config/save", executor);
  }
}