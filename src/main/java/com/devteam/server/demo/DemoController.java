package com.devteam.server.demo;

import java.util.concurrent.Callable;

import javax.servlet.http.HttpSession;

import com.devteam.core.module.http.rest.RestResponse;
import com.devteam.module.company.service.http.BaseCompanyController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;


@Api(value = "devteam", tags = { "demo" })
@RestController
@RequestMapping("/rest/v1.0.0/demo")
public class DemoController extends BaseCompanyController {

  @Autowired
  private DemoService service;
 
  protected DemoController() {
    super("app", "/demo");
  }
  
  @ApiOperation(value = "Import All Sample Data",  response = Boolean.class)
  @GetMapping("import/sample/all")
  public @ResponseBody RestResponse importAllPluginSample(HttpSession session) {
    Callable<Boolean> executor = () -> {
      ClientContext ctx = getClientContext(session);
      service.importAllPluginSample(ctx.getClientInfo(), ctx.getCompany());
      return true;
    };
    return execute(Method.GET, "import/sample/all", executor);
  }
  
  @ApiOperation(value = "Import Sample Data By Module And Plugin",  response = Boolean.class)
  @GetMapping("import/sample/{module}/{plugin}")
  public @ResponseBody RestResponse importPluginSample(HttpSession session, @PathVariable("module") String module, @PathVariable("plugin") String plugin) {
    Callable<Boolean> executor = () -> {
      ClientContext ctx = getClientContext(session);
      service.importPluginSample(ctx.getClientInfo(), ctx.getCompany(), module, plugin);
      return true;
    };
    return execute(Method.GET, "/import/sample/{module}/{plugin}", executor);
  }
}
