package com.devteam.core.module.http.upload;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;

import javax.servlet.http.HttpServletRequest;

import com.devteam.core.module.http.rest.RestResponse;
import com.devteam.core.module.http.rest.v1.AuthenticationService;
import com.devteam.core.module.http.rest.v1.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@ConditionalOnBean(AuthenticationService.class)
@Api(value="devteam", tags= {"core/upload"})
@RestController
@RequestMapping("/rest/v1.0.0/upload")
public class UploadController extends BaseController {
  protected UploadController() {
    super("tmpfs", "tmpfs");
  }

  @Autowired
  private UploadService uploadService;
  
  @PostMapping("file")
  @ApiOperation(value = "File Upload", response = UploadResource.class)
  public @ResponseBody RestResponse upload(@RequestParam("file") MultipartFile file) {
    Callable<UploadResource> executor = () -> {
      String baseUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/rest/v2/upload").toUriString();
      String baseResourceUri = baseUri + "/resource";
      String baseDownloadUri = baseUri + "/download";
      return uploadService.save(file, baseDownloadUri, baseResourceUri);
    };
    return execute(Method.POST, "file", executor);
  }

  @PostMapping("multi-file")
  @ApiOperation(value = "Multi Files Upload", responseContainer="List", response = UploadResource.class)
  public @ResponseBody RestResponse multiUpload(@RequestParam("files") MultipartFile[] files) {
    Callable<List<UploadResource>> executor = () -> {
      String baseUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/rest/v2/upload").toUriString();
      String baseResourceUri = baseUri + "/resource";
      String baseDownloadUri = baseUri + "/download";
      List<UploadResource> holder = new ArrayList<>();
      for(int i = 0; i < files.length; i++) {
        UploadResource resource = uploadService.save(files[i], baseDownloadUri, baseResourceUri);
        holder.add(resource);
      }
      return holder;
    };
    return execute(Method.POST, "multi-file", executor);
  }

  @GetMapping("resource/{id:.+}")
  public ResponseEntity<Resource> resource(@PathVariable String id, HttpServletRequest request) {
    return create(id, request, false);
  }
  
  @GetMapping("download/{id:.+}")
  public ResponseEntity<Resource> dowload(@PathVariable String id, HttpServletRequest request) {
    return create(id, request, true);
  }
  
  public ResponseEntity<Resource> create(String id, HttpServletRequest request, boolean download) {
    Resource resource = uploadService.loadAsResource(id);
    String contentType = request.getServletContext().getMimeType(resource.getFilename());
    if(download) {
      return ResponseEntity.ok()
          .contentType(MediaType.parseMediaType(contentType))
          .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
          .body(resource);
    } 
    return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
  }
}
