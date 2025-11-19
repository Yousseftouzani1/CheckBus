package ma.ensias.soa.user_service.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.user_service.dto.CreateUserRequest;
import ma.ensias.soa.user_service.entity.User;
import ma.ensias.soa.user_service.service.UserService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /* ============================================================
        CREATE USER
     ============================================================ */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        User created = userService.createUser(request);
        return ResponseEntity.ok(created);
    }

    /* ============================================================
        GET USER BY ID
     ============================================================ */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    /* ============================================================
        GET USER BY USERNAME
     ============================================================ */
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    /* ============================================================
        GET USER BY EMAIL
     ============================================================ */
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    /* ============================================================
        SEARCH USERS BY USERNAME
     ============================================================ */
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam("q") String keyword) {
        return ResponseEntity.ok(userService.searchUsersByUsername(keyword));
    }

    /* ============================================================
        UPDATE USER
     ============================================================ */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User request
    ) {
        Optional<User> existingUser = userService.getUserById(id);

        if (existingUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = existingUser.get();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        User updated = userService.updateUser(user);
        return ResponseEntity.ok(updated);
    }

    /* ============================================================
        DELETE USER
     ============================================================ */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /* ============================================================
        GET ALL USERS
     ============================================================ */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}

