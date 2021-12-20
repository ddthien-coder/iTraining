package com.devteam.core.module.data.db.entity;

public interface ICompany {
  static public ICompany MOCK = new MockCompany();
  
  public Long   getId();
  public String getCode() ;
  public String getLabel() ;
  
  static public class MockCompany implements ICompany {

    public Long getId() { return 1L; }

    @Override
    public String getCode() {
      return "mock";
    }

    @Override
    public String getLabel() { return "A mock company"; }
    
  }
}
