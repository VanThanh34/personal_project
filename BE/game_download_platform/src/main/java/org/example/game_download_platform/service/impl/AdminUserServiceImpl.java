package org.example.game_download_platform.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.response.AdminUserResponse;
import org.example.game_download_platform.entity.User;
import org.example.game_download_platform.repository.IUserRepository;
import org.example.game_download_platform.service.IAdminUserService;
import org.springframework.stereotype.Service;
import org.example.game_download_platform.entity.Role;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements IAdminUserService {

    private final IUserRepository userRepository;

    @Override
    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AdminUserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        return mapToResponse(user);
    }

    @Override
    public void disableUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow();
        user.setEnabled(false);
        userRepository.save(user);
    }

    @Override
    public void enableUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow();
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow();
        user.setEnabled(false);
        userRepository.save(user);
    }

    private AdminUserResponse mapToResponse(User user) {
        AdminUserResponse res = new AdminUserResponse();
        res.setId(user.getId());
        res.setUsername(user.getUsername());
        res.setEmail(user.getEmail());
        res.setEnabled(user.isEnabled());

        res.setRoles(
                user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet())
        );

        return res;
    }
}
