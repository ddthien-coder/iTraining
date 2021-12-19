package com.ddthien.itraining.core.http;

import java.util.HashMap;
import java.util.concurrent.Callable;

import javax.servlet.http.HttpSession;

import com.ddthien.itraining.core.common.ClientInfo;
import com.ddthien.itraining.core.common.ErrorType;
import com.ddthien.itraining.core.common.ServiceError;
import com.ddthien.itraining.core.http.rest.AuthenticationService;
import com.ddthien.itraining.core.http.rest.ClientSession;
import com.ddthien.itraining.core.http.rest.monitor.RestCallMonitorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;

import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@CrossOrigin(origins = "*")
@PreAuthorize("permitAll")
@ApiResponses(value = {
        @ApiResponse(code = 200, message = "Successfully"),
        @ApiResponse(code = 401, message = "You are not authorized to view the resource"),
        @ApiResponse(code = 403, message = "Accessing the resource you were trying to reach is forbidden"),
        @ApiResponse(code = 404, message = "The resource you were trying to reach is not found")
})
public class BaseController {
    static final Logger logger = LoggerFactory.getLogger(BaseController.class);

    static public enum Method {GET, POST, PUT, FIX, DELETE}

    @Autowired
    protected RestCallMonitorService monitorService;

    @Autowired
    protected AuthenticationService authService;

    private String module, service;

    protected BaseController(String module, String service) {
        this.module = module;
        this.service = service;
    }

    protected ClientSession getAuthorizedClientSession(HttpSession session) {
        ClientSession clientSession = authService.getAuthenticatedSession(session.getId());
        if(clientSession != null) {
            return clientSession;
        }
        throw new ServiceError(ErrorType.NotAuthorized, "You are not authorized");
    }

    protected ClientInfo getAuthorizedClientInfo(HttpSession session) {
        return this.getAuthorizedClientSession(session).getClientInfo();
    }

    protected ClientSession doLogin(HttpSession session, ClientInfo client) throws Exception {
        ClientSession clientSession = new ClientSession(client);
        authService.removeAuthenticatedSession(session.getId());
        authService.addAuthenticatedSession(clientSession);
        return clientSession;
    }

    protected ClientSession doLogout(HttpSession session) throws Exception {
        ClientSession authSession = authService.removeAuthenticatedSession(session.getId());
        if(authSession != null) {
            logger.info("User {} logout successfully ", authSession.getClientInfo().getRemoteUser());
        }
        return authSession;
    }

    @Deprecated
    protected <T> RestResponse execute(String endpoint, Callable<T> callable) {
        return execute(Method.FIX, endpoint, callable);
    }

    protected <T> RestResponse execute(Method method, String endpoint, Callable<T> callable) {
        RestResponse response = new RestResponse(module, service, endpoint) ;
        response.setReceivedAtTime(System.currentTimeMillis()) ;
        try {
            T result = callable.call();
            response.setDataAs(result);
        } catch(Throwable ex) {
            response.withError(service, ex);
            if(response.getError().getErrorType() == ErrorType.Unknown) {
                logger.error("Unknown Error when handle the method {}", endpoint);
                logger.error("Exception: ", ex);
            }
            logger.error("Unknown Error when handle the method {}", endpoint);
            logger.error("Exception: ", ex);
        }
        response.withFinishedAtTime(System.currentTimeMillis());
        endpoint = "[" + method + "] " + endpoint;
        monitorService.log(module, service, endpoint, response.getReceivedAtTime(), response.getFinishedAtTime(), response.getError());
        return response;
    }

    protected RestResponse handlePing(HttpSession session, String message) {
        Callable<HashMap<String, String>> executor = () -> {
            String remoteUser = "anon";
            ClientInfo clientInfo = getAuthorizedClientInfo(session);
            if(clientInfo != null) remoteUser = clientInfo.getRemoteUser();
            HashMap<String, String> map = new HashMap<String, String>();
            map.put("loginId", remoteUser);
            map.put("message",message);
            return map;
        };
        return execute("ping", executor);
    }

    protected ResponseEntity<Resource> createResource(String name, String mimeType, byte[] data, boolean download) {
        Resource resource = new ByteArrayResource(data);
        if(download) {
            return ResponseEntity.
                    ok().
                    contentType(MediaType.parseMediaType(mimeType)).
                    header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + name + ".pdf\"").
                    body(resource);
        }
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(mimeType)).body(resource);

    }

    protected ResponseEntity<Resource> createResource(String mimeType, Resource resource, boolean download) {
        if(download) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mimeType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        }
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(mimeType)).body(resource);
    }
}

