package com.devteam.core.module.data.db.repository.tenant;

import java.io.Serializable;

import javax.persistence.EntityManager;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactory;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactoryBean;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.data.repository.core.RepositoryInformation;
import org.springframework.data.repository.core.RepositoryMetadata;
import org.springframework.data.repository.core.support.RepositoryFactorySupport;
import org.springframework.util.Assert;

public class TenantRepositoryFactoryBean<R extends JpaRepository<T, I>, T , I extends Serializable> 
  extends JpaRepositoryFactoryBean<R, T, I> {
  
  public TenantRepositoryFactoryBean(Class<? extends R> repositoryInterface) {
    super(repositoryInterface);
  }

  @Override
  protected RepositoryFactorySupport createRepositoryFactory(EntityManager em) {
    return new BaseRepositoryFactory<T, I>(em);
  }

  private static class BaseRepositoryFactory<T, I extends Serializable> extends JpaRepositoryFactory {

    public BaseRepositoryFactory(EntityManager em) {
      super(em);
    }

    protected JpaRepositoryImplementation<?, ?> getTargetRepository(RepositoryInformation information, EntityManager em) {
      JpaEntityInformation<?, Serializable> entityInformation = getEntityInformation(information.getDomainType());
      Object repository = new TenantRepositoryImpl((Class<T>) information.getDomainType(), em); 
      Assert.isInstanceOf(JpaRepositoryImplementation.class, repository);
      return (JpaRepositoryImplementation<?, ?>) repository;
    }

    @Override
    protected Class<?> getRepositoryBaseClass(RepositoryMetadata metadata) {
      return TenantRepositoryImpl.class;
    }
  }
}