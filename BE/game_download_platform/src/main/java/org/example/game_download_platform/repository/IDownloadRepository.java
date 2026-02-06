package org.example.game_download_platform.repository;

import org.example.game_download_platform.dto.response.DownloadHistoryResponse;
import org.example.game_download_platform.entity.Download;
import org.example.game_download_platform.entity.Game;
import org.example.game_download_platform.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface IDownloadRepository extends JpaRepository<Download, Long> {


    Optional<Download> findTopByUserAndGameOrderByDownloadedAtDesc(
            User user,
            Game game
    );

    Page<Download> findByUser(User user, Pageable pageable);

    @Query("""
    select new org.example.game_download_platform.dto.response.DownloadHistoryResponse(
        d.id,           
        g.id,           
        g.title,       
        g.downloadUrl,          
        d.downloadedAt  
    )
    from Download d
    join d.game g
    where d.user.id = :userId
    order by d.downloadedAt desc
""")
    List<DownloadHistoryResponse> findDownloadHistoryByUserId(Long userId);

    long countByGame(Game game);
}

