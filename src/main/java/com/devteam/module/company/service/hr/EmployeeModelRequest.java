package com.devteam.module.company.service.hr;

import com.devteam.module.account.AccountModelRequest;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EmployeeModelRequest extends AccountModelRequest {

  private boolean loadCompany;

  public EmployeeModelRequest(String loginId) {
    super(loginId);
    setLoadAccount(false);
  }

  public EmployeeModelRequest loadCompany() {
    this.loadCompany = true;
    return this;
  }
}