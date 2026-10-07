package com.driveme.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.Properties;
import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@EnableAsync
public class PasswordResetConfiguration implements AsyncConfigurer {

    private static final Logger LOGGER =
            LoggerFactory.getLogger(PasswordResetConfiguration.class);

    @Bean(name = "passwordResetExecutor")
    public Executor passwordResetExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(2);
        executor.setQueueCapacity(20);
        executor.setThreadNamePrefix("password-reset-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.AbortPolicy());
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(20);
        executor.initialize();
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        // Aucun argument, adresse email ou détail SMTP dans les journaux.
        return (exception, method, arguments) ->
                LOGGER.error("Échec du traitement de réinitialisation du mot de passe.");
    }

    @Bean
    @ConditionalOnProperty(
            name = "app.password-reset.mail-enabled",
            havingValue = "true"
    )
    public JavaMailSender passwordResetMailSender(
            @Value("${app.password-reset.smtp-username:support@driveme.cloud}") String username,
            @Value("${app.password-reset.smtp-password}") String password
    ) {
        if (password == null || password.isBlank()) {
            throw new IllegalStateException("Mot de passe SMTP obligatoire.");
        }

        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost("smtp.mail.ovh.net");
        sender.setPort(465);
        sender.setUsername(username);
        sender.setPassword(password);
        sender.setDefaultEncoding("UTF-8");

        Properties properties = sender.getJavaMailProperties();
        properties.setProperty("mail.smtp.auth", "true");
        properties.setProperty("mail.smtp.ssl.enable", "true");
        properties.setProperty("mail.smtp.ssl.checkserveridentity", "true");
        properties.setProperty("mail.smtp.connectiontimeout", "8000");
        properties.setProperty("mail.smtp.timeout", "8000");
        properties.setProperty("mail.smtp.writetimeout", "8000");
        properties.setProperty("mail.debug", "false");
        return sender;
    }
}
