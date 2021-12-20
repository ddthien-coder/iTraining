package com.devteam.module.company.service.hr;

import java.util.List;

import com.devteam.module.account.NewAccountModel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor @Getter @Setter
public class NewEmployeeModel extends NewAccountModel {
  
  private List<Long> departmentIds;
  
}
