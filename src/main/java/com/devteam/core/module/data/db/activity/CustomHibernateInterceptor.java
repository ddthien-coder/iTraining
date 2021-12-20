package com.devteam.core.module.data.db.activity;

import java.io.Serializable;
import java.util.Iterator;

import com.devteam.core.module.data.db.activity.entity.EntityActivity;
import com.devteam.core.module.data.db.activity.entity.TransactionActivity;
import org.hibernate.EmptyInterceptor;
import org.hibernate.type.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class CustomHibernateInterceptor extends EmptyInterceptor {
  private static final long serialVersionUID = 1L;

  @Autowired
  private DataThreadContext threadContext ;
  
  @Override
  public boolean onFlushDirty(
      Object entity, Serializable id, Object[] currentState, Object[] previousState, String[] propertyNames, Type[] types) {
    TransactionActivity tActivity = threadContext.getCurrentTransactionActivity();
    if(tActivity == null) return false;
    Long entityId = (Long) id;
    EntityActivity entityActivity =
        new EntityActivity(entity, entityId, currentState, previousState, propertyNames, types);
    tActivity.withActivity(entityActivity);
    return false;
  }
  
  @Override
  public boolean onSave(
      Object entity, Serializable id, Object[] state, String[] propertyNames, Type[] types) {
    TransactionActivity tActivity = threadContext.getCurrentTransactionActivity();
    if(tActivity == null) return false;
    Long entityId = (Long) id;
    EntityActivity entityActivity = new EntityActivity(entity, entityId, state, propertyNames, types);
    tActivity.withActivity(entityActivity);
    return false;
  }

  @SuppressWarnings("rawtypes")
  @Override
  public void postFlush(Iterator entities) {
  }
}