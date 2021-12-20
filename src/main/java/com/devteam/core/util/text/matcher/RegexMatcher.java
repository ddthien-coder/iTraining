package com.devteam.core.util.text.matcher;

import java.util.regex.Pattern;

import dk.brics.automaton.Automaton;
import dk.brics.automaton.RegExp;
import dk.brics.automaton.RunAutomaton;

abstract public class RegexMatcher implements StringMatcher {
  static public RegexMatcher create(String exp) {
    return new PatternRegexMatcher(exp) ;
  }

  static public RegexMatcher createPattern(String exp) {
    return new PatternRegexMatcher(exp) ;
  }

  static public RegexMatcher createAutomaton(String exp) {
    exp = exp.replace("\\d", "[0-9]") ;
    exp = exp.replace("\\w", "[a-zA-Z_0-9]") ;
    return new AutomatonRegexMatcher(exp) ;
  }

  static public RegexMatcher createCustom(String exp) {
    return new CustomStringMatcher(exp) ;
  }

  static public class PatternRegexMatcher extends RegexMatcher {
    Pattern pattern  ;

    PatternRegexMatcher(String exp) { this.pattern = Pattern.compile(exp) ; }

    public boolean matches(String text)  { return pattern.matcher(text).matches() ; }
  }

  static public class AutomatonRegexMatcher extends RegexMatcher {
    RunAutomaton rautomaton ;
    Automaton automaton ;

    AutomatonRegexMatcher(String exp) {
      automaton = new RegExp(exp).toAutomaton() ;
      rautomaton = new RunAutomaton(new RegExp(exp).toAutomaton());	
    }

    public boolean matches(String text)  { return automaton.run(text) ; }
  }

  static public class CustomStringMatcher extends RegexMatcher {
    StringExpMatcher matcher ;

    CustomStringMatcher(String exp) {
      matcher = new StringExpMatcher(exp);	
    }

    public boolean matches(String text)  { return matcher.matches(text) ; }
  }
}
