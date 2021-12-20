package com.devteam.core.module.common;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Result<T> {
  static public enum Status { Success, Fail }
  
  private Status status;
  private T      data;
  private String message;
 
  public Result() {}
  
  public Result(Status status, T data) {
    this.status = status ;
  }
  
  public Result<T> withMessage(String mesg) {
    this.message = mesg;
    return this;
  }
}
