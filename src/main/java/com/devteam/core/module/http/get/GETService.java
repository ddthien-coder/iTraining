package com.devteam.core.module.http.get;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.ICompany;
import com.devteam.core.util.error.ErrorType;
import com.devteam.core.util.error.RuntimeError;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class GETService {
  private Map<String, GETHandler> handlers = new HashMap<>();
  
  public void register(GETHandler handler) {
    if(handlers.containsKey(handler.getName())) {
      throw new RuntimeError(ErrorType.IllegalArgument, "Handler " + handler.getName() + " is already registered");
    }
    handlers.put(handler.getName(), handler);
  }
  
  @Autowired(required = false)
  public void autoRegister(List<GETHandler> handlers) {
    for(GETHandler handler : handlers) {
      register(handler);
    }
  }
  
  public GETContent get(ClientInfo client, ICompany company, String handler, String path) {
    return handlers.get(handler).get(client, company, path);
  }

  public GETContent get(String handler, String path) {
    return handlers.get(handler).get(path);
  }
}
