package com.devteam.util.dataformat;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


import com.devteam.core.util.dataformat.DataSerializer;
import com.fasterxml.jackson.core.type.TypeReference;
import org.junit.jupiter.api.Test;


public class YamlDataFormatUnitTest {
  @Test
  public void test() {
    List<User> userList = new ArrayList<>();
    Map<String, User> userMap = new LinkedHashMap<>();
    
    User user1 = new User("Thien", "Dinh");
    userList.add(user1);
    userMap.put(user1.getFirstName(), user1);
    
    User user2 = new User("Devteam", "Viet Nam");
    userList.add(user2);
    userMap.put(user2.getFirstName(), user2);
    
    String userData = DataSerializer.YAML.toString(user1);
    System.out.println(userData);
    System.out.println("YAML data to user: " + DataSerializer.YAML.fromString(userData, User.class));
    
    String userListData = DataSerializer.YAML.toString(userList);
    System.out.println(userListData);
    System.out.println("YAML data to list user: " + DataSerializer.YAML.fromString(userListData, new TypeReference<List<User>>(){}));
    
    String userMapData = DataSerializer.YAML.toString(userMap);
    System.out.println(userMapData);
    System.out.println("YAML data to map user: " + DataSerializer.YAML.fromString(userMapData, new TypeReference<LinkedHashMap<String, User>>(){}));
  }
  
  static public class User {
    String firstName;
    String lastName;

    public User() { }
    
    public User(String fName, String lName) { 
      this.firstName = fName;
      this.lastName  = lName;
    }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String toString() {
      return "firstName = " + firstName + ", lastName = " + lastName ;
    }
  }
}
