package com.devteam.module.company.service.http;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;

import javax.servlet.http.HttpSession;

import com.devteam.core.module.data.db.query.SqlQueryParams;
import com.devteam.core.module.http.rest.RestResponse;
import com.devteam.core.module.http.rest.v1.AuthenticationService;
import com.devteam.core.module.security.SecurityService;
import com.devteam.core.module.security.entity.AppAccessPermission;
import com.devteam.core.module.security.entity.AppPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@ConditionalOnBean(AuthenticationService.class)
@Api(value="devteam", tags= {"security"})
@RestController
@RequestMapping("/rest/v1.0.0/security")
public class CompanyAppSecurityController extends BaseCompanyController {
  @Autowired
  private SecurityService service;

  protected CompanyAppSecurityController() {
    super("security", "/security");
  }

  @ApiOperation(value = "Save Permissions", responseContainer="List", response = AppPermission.class)
  @PutMapping("app/permissions")
  public @ResponseBody RestResponse savePermissions(HttpSession session, @RequestBody List<AppPermission> permissions) {
    Callable<List<AppPermission>> executor = () -> {
      BaseCompanyController.ClientContext ctx = getClientContext(session);
      List<AppPermission> list = new ArrayList<>();
      for (AppPermission sel : permissions) {
        sel.setCompanyId(ctx.getCompany().getId());
        list.add(sel);
      }
      return service.saveAppPermissions(ctx.getClientInfo(), list);
    };
    return execute(Method.PUT, "app/permissions", executor);
  }

  @ApiOperation(value = "Delete Permissions", response = Boolean.class)
  @DeleteMapping("app/permissions/delete")
  public @ResponseBody RestResponse deletePermissions(HttpSession session, @RequestBody List<Long> permissionIds) {
    Callable<Boolean> executor = () -> {
      BaseCompanyController.ClientContext ctx = getClientContext(session);
      return service.deletePermissionsById(ctx.getClientInfo(), permissionIds);
    };
    return execute(Method.DELETE, "app/permissions/delete", executor);
  }
  
  @ApiOperation(value = "Search Permission", responseContainer = "List", response = AppAccessPermission.class)
  @PostMapping("app/permission/search")
  public @ResponseBody RestResponse  searchCompanies(HttpSession session, @RequestBody SqlQueryParams params) {
    Callable<List<AppAccessPermission>> executor = () -> {
      BaseCompanyController.ClientContext ctx = getClientContext(session);
      return service.searchPermissions(ctx.getClientInfo(), ctx.getCompany().getId(), params);

    };
    return execute(Method.POST, "app/permission/search", executor);
  }
}