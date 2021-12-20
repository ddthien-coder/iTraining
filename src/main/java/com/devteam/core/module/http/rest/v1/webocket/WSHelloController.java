package com.devteam.core.module.http.rest.v1.webocket;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.devteam.core.module.http.rest.v1.AuthenticationService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;


@ConditionalOnBean(AuthenticationService.class)
@Controller
public class WSHelloController {
  
//  @MessageMapping("/hello/connect")
//  @SendTo("/hello/connect/success")
//  public ConnectResponse connect(ConnectRequest req) throws Exception {
//    System.out.println("[WSHelloController] connect(ConnectRequest req)");
//    Thread.sleep(500); // simulated delay
//    return new ConnectResponse("Hello, " + HtmlUtils.htmlEscape(req.getLoginId()) + "!");
//  }

  @MessageMapping("/chat")
  @SendTo("/topic/messages")
  public Message send(Message message) throws Exception {
      String time = new SimpleDateFormat("HH:mm").format(new Date());
      return new Message(message.getFrom(), message.getText() + time);
  }
}