package com.example.demo.filter;

import com.example.demo.service.JwtService;
import com.example.demo.service.myUserDetailService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final ApplicationContext context;
    private final org.springframework.web.servlet.HandlerExceptionResolver exceptionResolver;

    public JwtFilter(JwtService jwtService, ApplicationContext context, @org.springframework.beans.factory.annotation.Qualifier("handlerExceptionResolver") org.springframework.web.servlet.HandlerExceptionResolver exceptionResolver){
        this.jwtService=jwtService;
        this.context=context;
        this.exceptionResolver = exceptionResolver;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws
                                    ServletException, IOException {

        String path = request.getServletPath();


        String authHeader= request.getHeader("Authorization");
        String token;
        String userName;

        try {
            if(authHeader!=null&&authHeader.startsWith("Bearer ")){
                token = authHeader.substring(7);
                userName=jwtService.extractUserName(token);
                if(userName!=null){
                    UserDetails userDetails=context.getBean(myUserDetailService.class).loadUserByUsername(userName);
                    if(jwtService.validateToken(token,userDetails)){
                        UsernamePasswordAuthenticationToken authToken=new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            exceptionResolver.resolveException(request, response, null, e);
            return;
        } catch (io.jsonwebtoken.JwtException e) {
            exceptionResolver.resolveException(request, response, null, e);
            return;
        }

        filterChain.doFilter(request,response);

    }


}
