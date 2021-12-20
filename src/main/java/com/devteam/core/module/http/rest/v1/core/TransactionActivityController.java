package com.devteam.core.module.http.rest.v1.core;

import java.util.List;
import java.util.concurrent.Callable;

import javax.servlet.http.HttpSession;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.SqlMapRecord;
import com.devteam.core.module.data.db.activity.TransactionActivityService;
import com.devteam.core.module.data.db.activity.entity.EntityActivity;
import com.devteam.core.module.data.db.activity.entity.TransactionActivity;
import com.devteam.core.module.data.db.entity.ICompany;
import com.devteam.core.module.data.db.query.SqlQueryParams;
import com.devteam.core.module.http.rest.RestResponse;
import com.devteam.core.module.http.rest.v1.AuthenticationService;
import com.devteam.core.module.http.rest.v1.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;


@ConditionalOnBean(AuthenticationService.class)
@Api(value="devteam", tags={"core/entity/activity"})
@RestController
@RequestMapping("/rest/v1.0.0/core/entity/activity")
public class TransactionActivityController extends BaseController {
  @Autowired
  private TransactionActivityService service;
  
  protected TransactionActivityController() {
    super("core", "core/entity/activity");
  }
  
  @ApiOperation(value = "Retrieve the definitions", response = TransactionActivity.class)
  @GetMapping("transaction/{id}")
  public @ResponseBody RestResponse getDefinitions(HttpSession session, @PathVariable("id") Long id) {
    Callable<TransactionActivity> executor = () -> {
      ClientInfo client = getAuthorizedClientInfo(session);
      ICompany company = getCompany(session);
      return service.getTransactionActivity(client, company, id);
    };
    return execute(Method.GET, "transaction/{id}", executor);
  }
  
  @ApiOperation(value = "Search the definitions", response = List.class)
  @PostMapping("transaction/search")
  public @ResponseBody RestResponse searchDefinitions(HttpSession session, @RequestBody SqlQueryParams params) {
    Callable<List<SqlMapRecord>> executor = () -> {
      ClientInfo client = getAuthorizedClientInfo(session);
      ICompany company = getCompany(session);
      return service.searchTransactionActivities(client, company, params);
    };
    return execute(Method.GET, "transaction/search", executor);
  }

  @ApiOperation(value = "Retrieve the definitions", responseContainer="List", response = EntityActivity.class)
  @GetMapping("find")
  public @ResponseBody RestResponse findEntityActivity(
      HttpSession session,  @RequestParam("entityTable") String entityTable,  @RequestParam("entityId") Long entityId) {
    Callable<List<EntityActivity>> executor = () -> {
      ClientInfo client = getAuthorizedClientInfo(session);
      ICompany company = getCompany(session);
      return service.findEntityActivityByEntityId(client, company, entityTable, entityId);
    };
    return execute(Method.GET, "find", executor);
  }
}