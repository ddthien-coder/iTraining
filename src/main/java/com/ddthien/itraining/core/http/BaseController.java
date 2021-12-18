package com.ddthien.itraining.core.http;

import java.util.HashMap;
import java.util.concurrent.Callable;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    protected <T> RestResponse execute(Method method, String endpoint, Callable<T> callable) {
        RestResponse response = new RestResponse(endpoint) ;
        try {
            T result = callable.call();
            response.setDataAs(result);
        } catch(Throwable ex) {
            response.withError(endpoint, ex.getMessage());
            logger.error("Unknown Error when handle the method {}", endpoint);
            logger.error("Exception: ", ex);
        }
        endpoint = "[" + method + "] " + endpoint;
        return response;
    }

    protected RestResponse handlePing(Method method, HttpSession session, String message) {
        Callable<HashMap<String, String>> executor = () -> {
            String remoteUser = "anon";
            HashMap<String, String> map = new HashMap<String, String>();
            map.put("loginId", remoteUser);
            map.put("message",message);
            return map;
        };
        return execute(method, "ping", executor);
    }
}

