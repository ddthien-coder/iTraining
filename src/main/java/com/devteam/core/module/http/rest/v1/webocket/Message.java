package com.devteam.core.module.http.rest.v1.webocket;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
public class Message {
  @Getter @Setter
  private String from;
  @Getter @Setter
  private String text;
  
  public Message(String from, String text) {
    this.from = from;
    this.text = text;
  }
}