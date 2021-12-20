package com.devteam.module.company.core.repository;

import java.io.Serializable;

import com.devteam.core.module.data.db.repository.BaseRepository;
import com.devteam.module.company.core.entity.CompanyConfig;
import org.springframework.stereotype.Repository;


@Repository
public interface CompanyConfigRepository extends BaseRepository<CompanyConfig, Serializable> {
  public CompanyConfig getByCompanyId(Long companyId);
}
