package com.ddthien.itraining.module.http.rest;

import com.ddthien.itraining.core.http.BaseController;
import com.ddthien.itraining.core.http.RestResponse;
import com.ddthien.itraining.module.account.entity.Account;
import com.ddthien.itraining.module.account.entity.AccountGroup;
import com.ddthien.itraining.module.account.service.AccountService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.concurrent.Callable;

@Api(value = "ddthien", tags = { "account" })
@RestController
@RequestMapping("/rest/account")
@AllArgsConstructor
public class AccountController extends BaseController {

    final AccountService accountService;

    @ApiOperation(value = "Find all accounts", responseContainer = "List", response = Account.class)
    @GetMapping("account/all")
    public @ResponseBody RestResponse getAccounts(HttpSession session) {
        Callable<List<Account>> executor = () -> {
            return accountService.findAllAccounts();
        };
        return execute(Method.GET, "account/all", executor);
    }

    @ApiOperation(value = "Save account", response = Account.class)
    @PutMapping("account")
    public @ResponseBody RestResponse saveAccount(HttpSession session, @RequestBody Account account) {
        Callable<Account> executor = () -> {
            return accountService.saveAccount(account);
        };
        return execute(Method.PUT, "account", executor);
    }

    @ApiOperation(value = "find all account group", responseContainer = "List", response = Account.class)
    @GetMapping("group/all")
    public @ResponseBody RestResponse getAccountGroups(HttpSession session) {
        Callable<List<AccountGroup>> executor = () -> {
            return accountService.findAllAccountGroups();
        };
        return execute(Method.GET, "group/all", executor);
    }

    @ApiOperation(value = "Save account group", response = AccountGroup.class)
    @PutMapping("group")
    public @ResponseBody RestResponse saveAccountGroup(HttpSession session, @RequestBody AccountGroup group) {
        Callable<AccountGroup> executor = () -> {
            return accountService.saveAccountGroup(group);
        };
        return execute(Method.PUT, "group", executor);
    }

}

