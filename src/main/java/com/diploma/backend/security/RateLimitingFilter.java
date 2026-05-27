package com.diploma.backend.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(1) // Этот фильтр срабатывает самым первым
public class RateLimitingFilter implements Filter {

    // Храним "корзины" для каждого IP адреса
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    // Создаем новую корзину: 200 запросов в минуту
    private Bucket createNewBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(200, Refill.greedy(200, Duration.ofMinutes(1))))
                .build();
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String ip = httpRequest.getRemoteAddr();

        // Получаем или создаем корзину для этого IP
        Bucket bucket = buckets.computeIfAbsent(ip, k -> createNewBucket());

        // Пытаемся взять 1 токен. Если получилось - пропускаем.
        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            // Если токены кончились - возвращаем ошибку 429
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(429);
            httpResponse.setContentType("text/plain;charset=UTF-8");
            httpResponse.getWriter().write("Too many requests. Please try again later.");
        }
    }
}