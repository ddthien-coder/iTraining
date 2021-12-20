package com.devteam.core.module.http.rest.v1;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.http.session.ClientSession;
import com.devteam.core.module.http.session.ClientSessionService;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

@Component
public class AuthenticationService implements HttpSessionListener, ApplicationContextAware {
  @Autowired
  private ClientSessionService sessionService;
  private Map<String, AuthenticatedClient> authenticatedClients = new ConcurrentHashMap<>();

  @Override
  public void setApplicationContext(ApplicationContext appContext) throws BeansException {
    if (appContext instanceof WebApplicationContext) {
      ((WebApplicationContext) appContext).getServletContext().addListener(this);
    } 
  }

  @Override
  public void sessionCreated(HttpSessionEvent se) { }

  @Override
  public void sessionDestroyed(HttpSessionEvent se) {
    removeAuthenticatedSession(se.getSession().getId());
  }
  
  public ClientSession getAuthenticatedSession(String sessionId) {
    return sessionService.getSession(sessionId); 
  }
  
  synchronized public void addAuthenticatedSession(ClientSession session) {
    if(sessionService.hasSession(session.getSessionId())) return;
    ClientInfo client = session.getClientInfo();
    AuthenticatedClient authenticatedLogin = authenticatedClients.get(client.getClientId());
    if(authenticatedLogin == null) {
      authenticatedLogin = new AuthenticatedClient(client);
      authenticatedClients.put(client.getClientId(), authenticatedLogin);
    }
    authenticatedLogin.addSession(session);
    sessionService.addSession(session);
  }
  
  synchronized public ClientSession removeAuthenticatedSession(String sessionId) {
    ClientSession session  = sessionService.removeSession(sessionId);
    if(session == null) return null;
    ClientInfo client = session.getClientInfo();
    AuthenticatedClient authenticatedLogin = authenticatedClients.get(client.getClientId());
    authenticatedLogin.removeSession(session);
    if(authenticatedLogin.isEmpty()) {
      authenticatedClients.remove(client.getClientId());
    }
    return session;
  }
}