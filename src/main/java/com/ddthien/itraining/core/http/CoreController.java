package com.ddthien.itraining.core.http;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;

@Api(value = "ddthien", tags = { "core" })
@RestController
@RequestMapping("/rest/core")
public class CoreController extends BaseController {

    @ApiOperation(value = "Ping to test the controller status", response = HashMap.class)
    @GetMapping("ping")
    public @ResponseBody RestResponse ping(HttpSession session, @RequestParam String message) {
        System.out.println("CoreController: ping message = " + message);
        return handlePing(Method.GET, session, message);
    }
}
