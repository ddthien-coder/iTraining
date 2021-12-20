package com.devteam.core.module.data.db.repository;
import java.io.Serializable;
import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.ICompany;
import com.devteam.core.module.data.db.entity.Persistable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;


@NoRepositoryBean
public interface BaseRepository<T extends Persistable<? extends Serializable>, ID extends Serializable>
  extends JpaRepository<T, ID> {

  T getByCode(ClientInfo client, String code);
  T getByCode(ClientInfo client, ICompany company, String code);
  
  T reload(T entity);
  List<T> reload(List<T> entity);
  
  List<Long> findAvailableIds(ClientInfo client) ;

  T save(ClientInfo client, T entity);
  T save(ClientInfo client, ICompany company, T entity);

  List<T> saveAll(ClientInfo client, List<T> entity);
  List<T> saveAll(ClientInfo client, ICompany company, List<T> entity);
}