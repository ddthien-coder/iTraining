package com.devteam.core.util.stat;

public interface StatisticVisitor {
	public void onVisit(Statistic statistics, StatisticEntry statistic) ;
}
