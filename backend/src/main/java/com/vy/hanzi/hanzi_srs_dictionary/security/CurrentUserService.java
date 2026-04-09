package com.vy.hanzi.hanzi_srs_dictionary.security;

import com.vy.hanzi.hanzi_srs_dictionary.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserService {

    public Long getCurrentUserIdOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            return null;
        }
        return principal.getUserId();
    }

    public Long requireUserId() {
        Long userId = getCurrentUserIdOrNull();
        if (userId == null) {
            throw new UnauthorizedException("Unauthorized");
        }
        return userId;
    }
}
