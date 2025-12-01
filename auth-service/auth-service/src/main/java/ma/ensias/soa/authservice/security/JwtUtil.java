package ma.ensias.soa.authservice.security;
import ma.ensias.soa.authservice.entity.UserAuth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret:mySecretKey}")
    private String secret;

    // Standard expiration (1 hour)
    private static final long JWT_TOKEN_VALIDITY = 3600; // 1 hour in seconds

    // Extended expiration for "remember me" (30 days)
    private static final long JWT_REMEMBER_ME_VALIDITY = 30 * 24 * 3600; // 30 days in seconds

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String extractEmail(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public Long extractUserId(String token) {
        return getClaimFromToken(token, claims -> claims.get("userId", Long.class));
    }

    public String extractName(String token) {
        return getClaimFromToken(token, claims -> claims.get("name", String.class));
    }



    public Integer extractState(String token) {
        return getClaimFromToken(token, claims -> claims.get("state", Integer.class));
    }

    public String extractEmailRole(String token) {
        return getClaimFromToken(token, claims -> claims.get("role", String.class));
    }



    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    // Generate token with standard expiration (backward compatibility)
    public String generateToken(UserAuth user) {
        return generateToken(user, false);
    }

    // Generate token with optional extended expiration for remember me
    public String generateToken(UserAuth user, boolean rememberMe) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("name", user.getUsername());
        claims.put("email", user.getEmail());
        claims.put("rememberMe", rememberMe); // Added this line
        claims.put("role", user.getRole().name());

        long validity = rememberMe ? JWT_REMEMBER_ME_VALIDITY : JWT_TOKEN_VALIDITY;
        return createToken(claims, user.getEmail(), validity);
    }

    private String createToken(Map<String, Object> claims, String subject, long validityInSeconds) {
        long validityInMillis = validityInSeconds * 1000;

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + validityInMillis))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public Boolean validateToken(String token, String email) {
        final String tokenEmail = extractEmail(token);
        return (tokenEmail.equals(email) && !isTokenExpired(token));
    }

    // Check if token was issued with remember me option
    public Boolean isRememberMeToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return Boolean.TRUE.equals(claims.get("rememberMe", Boolean.class));
        } catch (Exception e) {
            return false;
        }
    }
}
