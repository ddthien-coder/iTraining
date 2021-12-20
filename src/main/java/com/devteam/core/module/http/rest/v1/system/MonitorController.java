package com.devteam.core.module.http.rest.v1.system;

import java.util.HashMap;
import java.util.concurrent.Callable;

import javax.servlet.http.HttpSession;

import com.devteam.core.module.http.rest.RestResponse;
import com.devteam.core.module.http.rest.monitor.JVMService;
import com.devteam.core.module.http.rest.monitor.JVMSummary;
import com.devteam.core.module.http.rest.monitor.RestCallMonitorService;
import com.devteam.core.module.http.rest.monitor.RestMonitor;
import com.devteam.core.module.http.rest.v1.AuthenticationService;
import com.devteam.core.module.http.rest.v1.BaseController;
import com.devteam.core.util.jvm.JVMInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@ConditionalOnBean(AuthenticationService.class)
@Api(value="devteam", tags= {"core/monitor"})
@RestController
@RequestMapping("/rest/v1.0.0/core/monitor")
public class MonitorController extends BaseController {
  @Autowired
  private JVMService jvmService;
  
  @Autowired
  private RestCallMonitorService restCallMonitorService;
  
  protected MonitorController() {
    super("core", "monitor");
  }
  
  @ApiOperation(value = "Ping", response = HashMap.class)
  @RequestMapping(value = "ping", method = {RequestMethod.GET, RequestMethod.POST})
  public @ResponseBody RestResponse ping(HttpSession session) {
    return handlePing(session, "[MockController] Hello");
  }
  
  @ApiOperation(value = "Retrieve the jvm summary", response = JVMSummary.class)
  @GetMapping("jvm/summary")
  public @ResponseBody RestResponse jvmSummary(HttpSession session) {
    Callable<JVMSummary> executor = () -> {
      return jvmService.getMonitorSummary();
    };
    return execute(Method.GET, "jvm-summary", executor);
  }

  
  @ApiOperation(value = "Retrieve the jvm info", response = JVMInfo.class)
  @GetMapping("jvm")
  public @ResponseBody RestResponse jvmInfo(HttpSession session) {
    Callable<JVMInfo> executor = () -> {
      return jvmService.getMonitor();
    };
    return execute(Method.GET, "jvm", executor);
  }

  @ApiOperation(value = "Retrieve the rest monitor summary", response = JVMSummary.class)
  @GetMapping("rest/summary")
  public @ResponseBody RestResponse restSummary(HttpSession session) {
    Callable<JVMSummary> executor = () -> {
      return restCallMonitorService.getMonitorSummary();
    };
    return execute(Method.GET, "rest-summary", executor);
  }
  
  @ApiOperation(value = "Retrieve the rest monitor info", response = RestMonitor.class)
  @GetMapping("rest")
  public @ResponseBody RestResponse restInfo(HttpSession session) {
    Callable<RestMonitor> executor = () -> {
      return restCallMonitorService.getMonitor();
    };
    return execute(Method.GET,  "rest", executor);
  }
}