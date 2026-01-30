package org.example.game_download_platform.repository;

import org.example.game_download_platform.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IRoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);
}
