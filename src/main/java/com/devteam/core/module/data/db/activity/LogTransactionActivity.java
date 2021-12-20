package com.devteam.core.module.data.db.activity;

import java.lang.annotation.Target;

import org.springframework.core.annotation.AliasFor;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogTransactionActivity {
  @AliasFor("name")
  String value() default "";
  
  @AliasFor("value")
  String name() default "";

  String label() default "";
}
