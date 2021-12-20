package com.devteam.util.stat;

import com.devteam.core.util.stat.Statistics;
import org.junit.jupiter.api.Test;

public class StatisticsUnitTest {
  @Test
  public void test() {
    Statistics allStats = new Statistics() ;
    allStats.incr("category1", "name1", 1) ;
    allStats.incr("category1", "name2", 1) ;

    allStats.incr("category2", "all", 3) ;
    allStats.incr("category2", "name1", "all", 1) ;
    allStats.incr("category2", "name2", "all", 1) ;
    allStats.incr("category2", "name2", "all", 1) ;

    allStats.report(System.out) ;
  }
  
}
