package com.devteam.core.module.data.db.activity;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.activity.entity.TransactionActivity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;


class TransactionActivityMessageHandler implements MessageHandler {
  @Autowired
  private TransactionActivityService service;
  
  @Override
  public void handleMessage(Message<?> message) throws MessagingException {
    TransactionActivity tActivity = (TransactionActivity) message.getPayload();
    service.saveTransactionActivity(ClientInfo.DEFAULT, tActivity);
  }
}