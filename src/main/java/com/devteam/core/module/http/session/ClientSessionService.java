package com.devteam.core.module.http.session;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.devteam.core.module.common.ClientInfo;
import org.springframework.stereotype.Service;

@Service
public class ClientSessionService {
  private Map<String, ClientSession> sessions = new ConcurrentHashMap<>();
  
  public boolean hasSession(String sessionId) { return sessions.containsKey(sessionId); }
  
  public ClientSession getSession(String sessionId) { return sessions.get(sessionId); }
  
  public ClientSession getSession(ClientInfo client) { return sessions.get(client.getSessionId()); }
  
  public void addSession(ClientSession container) {
    sessions.put(container.getSessionId(), container);
  }
  
  public ClientSession removeSession(String sessionId) { 
    return sessions.remove(sessionId); 
  }
}
