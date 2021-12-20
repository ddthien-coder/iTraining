package com.devteam.server.http;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.devteam.core.module.srpingframework.app.AppEnv;
import com.devteam.core.util.dataformat.DataSerializer;
import com.devteam.core.util.io.IOUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class WebuiController {
  static class Config {
    String build = "latest";
  }

  @Autowired
  AppEnv appEnv;
  
  @GetMapping( value= { "app/config.js" } )
  public void appConfig(HttpServletRequest req, HttpServletResponse response) throws Exception {
    response.setContentType("application/javascript");
    String content = "var CONFIG = " + DataSerializer.JSON.toString(new Config());
    response.getWriter().write(content);
    response.getWriter().flush();
  }
  
  @GetMapping( 
    value= { 
      "/", "/admin/app", "/admin/app/ws:{id}/**", "/admin/login/app"
    }
  )
  public void appPage(HttpServletRequest req, HttpServletResponse response) throws Exception {
    process(req, response);
  }

  void process(HttpServletRequest req, HttpServletResponse response) {
    try {
      response.setContentType("text/html");
      String content = IOUtil.getResourceAsString("public/index.html", "UTF-8");
      response.getWriter().write(content);
      response.getWriter().flush();
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }
}