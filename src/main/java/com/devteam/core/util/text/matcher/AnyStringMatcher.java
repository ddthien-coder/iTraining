package com.devteam.core.util.text.matcher;

public class AnyStringMatcher implements StringMatcher {
  private StringMatcher[] matchers;
  
  public AnyStringMatcher(StringMatcher ... matchers) {
    this.matchers = matchers;
  }
  
  @Override
  public boolean matches(String string) {
    for(StringMatcher sel : matchers) {
      if(sel.matches(string)) return true;
    }
    return false;
  }

}
