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

    public JwtFilter(JwtService jwtService,ApplicationContext context){
        this.jwtService=jwtService;
        this.context=context;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws
                                    ServletException, IOException {

        String path = request.getServletPath();

        if(path.contains("/auth") ||
                path.startsWith("/swagger-ui") ||
                path.startsWith("/v3/api-docs")
        )
        {

            filterChain.doFilter(request, response);
            return;
        }
        String authHeader= request.getHeader("Authorization");
        String token;
        String userName;

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
        filterChain.doFilter(request,response);

    }


}
