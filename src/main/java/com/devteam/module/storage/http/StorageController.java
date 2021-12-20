package com.devteam.module.storage.http;

import java.util.List;
import java.util.concurrent.Callable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.http.rest.RestResponse;
import com.devteam.core.module.http.rest.v1.AuthenticationService;
import com.devteam.core.module.http.rest.v1.BaseController;
import com.devteam.core.module.http.upload.UploadResource;
import com.devteam.core.module.http.upload.UploadResourceRequest;
import com.devteam.module.storage.IStorageService;
import com.devteam.module.storage.SNode;
import com.devteam.module.storage.UserStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;



@ConditionalOnBean(AuthenticationService.class)
@Api(value = "devteam", tags = {"storage"})
@RestController
@RequestMapping("/rest/v1.0.0/storage")
public class StorageController extends BaseController {

  @Autowired
  private IStorageService service;
  
  protected StorageController() {
    super("storage", "service");
  }

  @ApiOperation(value = "Get System Node By Path", response = SNode.class)
  @GetMapping(path = {"system"})
  public @ResponseBody RestResponse systemGetSNode(
    HttpSession session,
    @RequestParam String path, @RequestParam(required = false) boolean loadChildren) {
    Callable<SNode> executor = () -> {
      ClientInfo client = getAuthorizedClientInfo(session);
      return service.getNode(client, path, loadChildren);
    };
    return execute(Method.GET, "system", executor);
  }

  @ApiOperation(value = "Get User Node By Path", response = SNode.class)
  @GetMapping(path = {"user"})
  public @ResponseBody
  RestResponse userGetSNode(HttpSession session,
    @RequestParam String path, @RequestParam(required = false) boolean loadChildren) {
    Callable<SNode> executor = () -> {
      ClientInfo client = getAuthorizedClientInfo(session);
      UserStorage storage = service.createUserStorage(client, client.getRemoteUser());
      return storage.getNode(path, loadChildren);
    };
    return execute(Method.GET, "user", executor);
  }

  @ApiOperation(value = "Upload user resources", responseContainer = "List", response = UploadResource.class)
  @PostMapping(path = {"user/upload"})
  public RestResponse userUpload(HttpSession session, @RequestBody UploadResourceRequest req) {
    Callable<List<UploadResource>> executor = () -> {
      ClientInfo client = getAuthorizedClientInfo(session);
      UserStorage storage = service.createUserStorage(client, client.getRemoteUser());
      storage.uploadDep(req.getStoragePath(), req.getUploadResources());
      return req.getUploadResources();
    };
    return execute(Method.POST, "upload-to-user", executor);
  }

  @ApiOperation(value = "Get system resource", response = ResponseEntity.class)
  @GetMapping("/content/system")
  public ResponseEntity<Resource> systemGetContent(
    HttpSession session, HttpServletRequest request,
    @RequestParam String path, @RequestParam(required = false) boolean download) {

    ClientInfo client = getAuthorizedClientInfo(session);
    Resource resource = service.getContentAsResource(client, path);
    String mimeType = request.getServletContext().getMimeType(resource.getFilename());
    return createResource(mimeType, resource, download);
  }


  @ApiOperation(value = "Upload resources", responseContainer = "List", response = UploadResource.class)
  @PostMapping(path = {"system/upload"})
  public RestResponse uploadSystem(HttpSession session, @RequestBody UploadResourceRequest req) {
    Callable<List<UploadResource>> executor = () -> {
      ClientInfo client = getAuthorizedClientInfo(session);
      service.uploadDep(client, req.getStoragePath(), req.getUploadResources());
      return req.getUploadResources();
    };
    return execute(Method.POST, "system/upload", executor);
  }
}
