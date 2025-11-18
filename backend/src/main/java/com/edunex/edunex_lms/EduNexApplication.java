package com.edunex.edunex_lms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class EduNexApplication {

	public static void main(String[] args) {
		SpringApplication.run(EduNexApplication.class, args);
	}

}
