
package com.devteam.core.module.data.db.activity.repository;

import com.devteam.core.module.data.db.activity.entity.TransactionActivity;
import com.devteam.core.module.data.db.repository.BaseRepository;
import org.springframework.stereotype.Repository;

import java.io.Serializable;

@Repository
public interface TransactionActivityRepository extends BaseRepository<TransactionActivity, Serializable> {
}