package com.devteam.core.db;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Table;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.query.*;
import com.devteam.core.util.dataformat.DataSerializer;
import org.junit.jupiter.api.Test;

import lombok.Getter;
import lombok.Setter;

public class SqlQueryUnitTest {
  @Test
  public void testQueryGenerator() {
    String[] option = {"option-1", "option-2"};
    SqlQuery SQL = new SqlQuery();
    SQL.
      ADD_TABLE(new EntityTable(Account.class).selectAllFields()).
      FILTER(
        new SearchFilter(Account.class, new String[] {"loginId", "email", "fullName"}, "LIKE", "search"),
        new SearchFilter(Account.class, "joinDate", "=", "joinDate")).
      FILTER(
        new OptionFilter(Account.class, "email", "=", option),
        new RangeFilter(Account.class, "birthday")).
      GROUPBY("date").
      ORDERBY("date");

    SQL.filter("search").value("test");
    SQL.filter("joinDate").value("1/1/2018@10:00:00");
    SQL.option("email").value("option-1");
    SQL.range("birthday").fromValue("1/1/2018@10:00:00").toValue("10/1/2018@10:00:00");
    
    System.out.println(SQL.toSql(ClientInfo.DEFAULT));
    System.out.println("--------------------------------------------------");
    System.out.println(DataSerializer.JSON.toString(SQL.getSqlQueryParams()));
  }

  @Test
  public void testJoin() {
    SqlQuery SQL = new SqlQuery();
    SQL.
      ADD_TABLE(new EntityTable(Membership.class).selectAllFields()).
      JOIN(
          new Join("INNER", Account.class).addSelectField("fullName", "fullName").
          ON("loginId", Membership.class, "loginId").
          AND("fullName", "LIKE", ":search")).
      FILTER(
        new SearchFilter(Membership.class, new String[] {"loginId"}, "LIKE", "search"));

    SQL.filter("search").value("test");
    
    System.out.println(SQL.toSql(ClientInfo.DEFAULT));
    System.out.println("--------------------------------------------------");
    System.out.println(DataSerializer.JSON.toString(SQL.getSqlQueryParams()));
  }
  
  
  @Table(name = "account")
  @Getter @Setter
  static public class Account {
    @Column(name = "login_id")
    private String loginId;
    @Column(name = "full_name")
    private String fullName;
    private String email;
    @Column(name = "join_date")
    private Date   joinDate;
    private Date   birthday;
  }

  @Table(name = "account_group")
  @Getter @Setter
  static public class AccountGroup {
    private String name;
    @Column(name = "group_path")
    private String groupPath;
    
  }

  @Table(name = "account_membership")
  @Getter @Setter
  static public class Membership {
    private String loginId;
    @Column(name = "group_path")
    private String groupPath ;
    private String membership ;
  }
}
