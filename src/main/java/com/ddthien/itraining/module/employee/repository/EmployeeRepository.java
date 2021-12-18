package com.ddthien.itraining.module.employee.repository;

import java.util.List;

import com.ddthien.itraining.module.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("select e from Employee e where e.account.loginId = :login")
    Employee getByAccountLogin(@Param("login") String login);

    @Query("select e from Employee e")
    List<Employee> getAll();

}
