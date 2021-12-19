package com.ddthien.itraining.core.common;

public class ClientInfo {
    final static public ClientInfo DEFAULT = new ClientInfo("default", "admin", "localhost");

    private String tenantId = "default";
    private String remoteUser;
    private String remoteIp ;
    private String sessionId;

    public ClientInfo() { }

    public ClientInfo(String tenantId, String user, String ip) {
        this(tenantId, user, ip, user);
    }

    public ClientInfo(String tenantId, String user, String ip, String sessionId) {
        this.tenantId   = tenantId;
        this.remoteUser = user;
        this.remoteIp   = ip;
        this.sessionId  = sessionId;
    }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public String getRemoteUser() { return remoteUser; }
    public void setRemoteUser(String remoteUser) { this.remoteUser = remoteUser; }

    public String getRemoteIp() { return remoteIp; }
    public void setRemoteIp(String remoteIp) { this.remoteIp = remoteIp; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getClientId() { return tenantId + ":" + remoteUser; }
}

