package com.example.JS_shell;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class homecontroller {
    @RequestMapping("/")
    public String index(){
        return "index.html";
    }
}
