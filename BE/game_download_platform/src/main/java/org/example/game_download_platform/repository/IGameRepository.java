package org.example.game_download_platform.repository;

import org.example.game_download_platform.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface IGameRepository extends JpaRepository<Game, Long> , JpaSpecificationExecutor<Game> {

    Page<Game> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Game> findByCategory_Id(Long categoryId, Pageable pageable);
    Page<Game> findByEnabledTrue(Pageable pageable);

    Optional<Game> findByIdAndEnabledTrue(Long id);
    List<Game> findTop10ByOrderByDownloadCountDesc();

    List<Game> findTop10ByOrderByViewCountDesc();

    Page<Game> findByEnabledTrueOrderByViewCountDesc(Pageable pageable);

    Page<Game> findByEnabledTrueOrderByDownloadCountDesc(Pageable pageable);

    long countByEnabledTrue();

    long count();

    long countByEnabledFalse();

}

