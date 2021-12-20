package com.devteam.core.module.http.rest.v1.system;

import java.util.List;
import java.util.concurrent.Callable;

import javax.servlet.http.HttpSession;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.EntityInfo;
import com.devteam.core.module.data.db.JPAService;
import com.devteam.core.module.http.rest.RestResponse;
import com.devteam.core.module.http.rest.v1.AuthenticationService;
import com.devteam.core.module.http.rest.v1.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@ConditionalOnBean(AuthenticationService.class)
@Api(value="devteam", tags= {"system/db"})
@RestController
@RequestMapping("/rest/v1.0.0/system/db")
public class DBController extends BaseController {
  @Autowired
  private JPAService jpaService;
  
  protected DBController() {
    super("system", "/system/db");
  }
  
  @ApiOperation(value = "Load All Entities", responseContainer = "List", response = EntityInfo.class)
  @GetMapping("entity/all")
  public @ResponseBody RestResponse loadAllEntities(HttpSession session) {
    Callable<List<EntityInfo>> executor = () -> {
      ClientInfo client = getAuthorizedClientInfo(session);
      return jpaService.getEntityInfos(client);
    };
    return execute(Method.GET, "entity/all", executor);
  }
}