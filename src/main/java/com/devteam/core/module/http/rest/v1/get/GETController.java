package com.devteam.core.module.http.rest.v1.get;

import javax.servlet.http.HttpServletRequest;

import com.devteam.core.module.data.db.entity.ICompany;
import com.devteam.core.module.http.get.GETContent;
import com.devteam.core.module.http.get.GETService;
import com.devteam.core.module.http.rest.v1.AuthenticationService;
import com.devteam.core.module.http.rest.v1.BaseController;
import com.devteam.core.module.http.session.ClientSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;



@ConditionalOnBean(AuthenticationService.class)
@Api(value = "devteam", tags = {"download", "get"})
@RestController
@RequestMapping("/get")
public class GETController extends BaseController {
  
  @Autowired
  private GETService service;
  
  protected GETController() {
    super("http", "/get");
  }
  
  @ApiOperation(value = "Get Or Download", response = ResponseEntity.class)
  @GetMapping("{handler}/{pathPrefix}/**")
  public ResponseEntity<Resource> preview(
      HttpServletRequest request, 
      @PathVariable("handler") String handler, @PathVariable("pathPrefix") String pathPrefix,
      @RequestParam(required = false) boolean download) {
    String path = parseEndRequestUrl(request, pathPrefix);
    GETContent content = service.get(handler, path);
    Resource resource = content.createResource(request);
    return createResource(content.getMimeType(), resource, download);
  }

  @ApiOperation(value = "Get Or Download", response = ResponseEntity.class)
  @GetMapping("private/{handler}/{pathPrefix}/**")
  public ResponseEntity<Resource> privatePreview(
      HttpServletRequest request, 
      @PathVariable("handler") String handler, @PathVariable("pathPrefix") String pathPrefix,
      @RequestParam(required = false) boolean download) {
    ClientSession clientSession = getAuthorizedClientSession(request.getSession(false));
    ICompany company = clientSession.getBean(ICompany.class);
    String path = parseEndRequestUrl(request, pathPrefix);
    GETContent content = service.get(clientSession.getClientInfo(), company, handler, path);
    Resource resource = content.createResource(request);
    return createResource(content.getMimeType(), resource, download);
  }
  
}
