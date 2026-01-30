package org.example.game_download_platform.controller;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.response.AdminUserResponse;
import org.example.game_download_platform.service.IAdminUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminUserController {

    private final IAdminUserService adminUserService;

    @GetMapping
    public List<AdminUserResponse> getAll() {
        return adminUserService.getAllUsers();
    }

    @GetMapping("/{id}")
    public AdminUserResponse getById(@PathVariable Long id) {
        return adminUserService.getUserById(id);
    }

    @PutMapping("/{id}/disable")
    public void disable(@PathVariable Long id) {
        adminUserService.disableUser(id);
    }

    @PutMapping("/{id}/enable")
    public void enable(@PathVariable Long id) {
        adminUserService.enableUser(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        adminUserService.deleteUser(id);
    }
}

