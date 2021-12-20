package com.devteam.core.module.http.rest.v1.mock;

import java.util.concurrent.Callable;

import javax.servlet.http.HttpSession;

import com.devteam.core.module.http.rest.RestResponse;
import com.devteam.core.module.http.rest.v1.AuthenticationService;
import com.devteam.core.module.http.rest.v1.BaseController;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
@ConditionalOnBean(AuthenticationService.class)
@Api(value="devteam", tags= {"core/mock"})
@RestController
@RequestMapping("/rest/v1.0.0/mock")
public class MockController extends BaseController {
  
  protected MockController() {
    super("core", "mock");
  }
  
  @ApiOperation(value = "Mock", response = Object.class)
  @RequestMapping(value = "/**", method = {RequestMethod.GET, RequestMethod.POST})
  public @ResponseBody RestResponse mock(HttpSession session, @RequestBody Object data) {
    Callable<Object> executor = () -> { return data; };
    return execute("mock", executor);
  }
}