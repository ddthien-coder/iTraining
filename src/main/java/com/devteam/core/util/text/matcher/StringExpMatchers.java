package com.devteam.core.util.text.matcher;

public class StringExpMatchers implements StringMatcher {
  private StringExpMatcher[] matcher;
  
  public StringExpMatchers(String[] exp) {
    matcher = StringExpMatcher.create(exp);
  }
  
  public StringExpMatchers(String[] exp, boolean normalize) {
    for(int i = 0; i < exp.length; i++) {
      exp[i] = exp[i].toLowerCase().trim();
    }
    matcher = StringExpMatcher.create(exp);
  }
  
  public boolean matches(String string) {
    for(StringExpMatcher sel : matcher) {
      if(sel.matches(string)) return true ;
    }
    return false; 
  }
}
