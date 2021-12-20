package com.devteam.module.account;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor @Getter @Setter
public class ChangePasswordRequest {
  private String loginId;
  private String oldPassword;
  private String newPassword;
  private String confirmPassword;
}
