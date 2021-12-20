package com.devteam.core.module.http.rest.v1.core;

import java.util.List;
import java.util.concurrent.Callable;

import javax.servlet.http.HttpSession;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.plugin.ServicePluginService;
import com.devteam.core.module.data.db.plugin.entity.PluginInfo;
import com.devteam.core.module.http.rest.RestResponse;
import com.devteam.core.module.http.rest.v1.AuthenticationService;
import com.devteam.core.module.http.rest.v1.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;


@ConditionalOnBean(AuthenticationService.class)
@Api(value="devteam", tags={"core/plugin"})
@RestController
@RequestMapping("/rest/v1.0.0/core/plugin")
public class PluginInfoController extends BaseController {
  @Autowired
  private ServicePluginService pluginService;
  
  protected PluginInfoController() {
    super("core", "/plugin");
  }
  
  @ApiOperation(value = "Retrieve the plugin info", response = PluginInfo.class)
  @GetMapping("/{module}/{servivce}/{type}")
  public @ResponseBody RestResponse getPluginInfo(
      HttpSession session,
      @PathVariable("module") String module, @PathVariable("service") String service, @PathVariable("type") String type) {

    Callable<PluginInfo> executor = () -> {
      ClientInfo client = getAuthorizedClientInfo(session);
      return pluginService.getPlugin(client, module, service, type);
    };
    return execute(Method.GET, "get-plugin-info", executor);
  }
  
  @ApiOperation(value = "Find PluginInfo by module and service", responseContainer = "List", response = PluginInfo.class)
  @GetMapping("find")
  public @ResponseBody RestResponse findPlugins(HttpSession session, @RequestParam String module, @RequestParam String service ) {
    Callable<List<PluginInfo>> executor = () -> {
      ClientInfo client = getAuthorizedClientInfo(session);
      return pluginService.find(client, module, service);
    };
    return execute(Method.GET, "find", executor);
  }
  
  @ApiOperation(value = "Save the PluginInfo", response = PluginInfo.class)
  @PutMapping
  public @ResponseBody RestResponse savePluginInfo(HttpSession session, @RequestBody PluginInfo pluginInfo) {
    Callable<PluginInfo> executor = () -> {
      return pluginInfo;
    };
    return execute(Method.PUT, "", executor);
  }
  
  @ApiOperation(value = "Search PluginInfo", responseContainer = "List", response = PluginInfo.class)
  @GetMapping("find-all")
  public @ResponseBody RestResponse findAll(HttpSession session) {
    Callable<List<PluginInfo>> executor = () -> {
      ClientInfo client = getAuthorizedClientInfo(session);
      return pluginService.findAll(client);
    };
    return execute(Method.GET, "find-all", executor);
  }
}