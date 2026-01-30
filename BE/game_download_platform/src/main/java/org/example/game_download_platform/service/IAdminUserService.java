package org.example.game_download_platform.service;

import org.example.game_download_platform.dto.response.AdminUserResponse;

import java.util.List;

public interface IAdminUserService {

    List<AdminUserResponse> getAllUsers();

    AdminUserResponse getUserById(Long id);

    void disableUser(Long id);

    void enableUser(Long id);

    void deleteUser(Long id);
}

