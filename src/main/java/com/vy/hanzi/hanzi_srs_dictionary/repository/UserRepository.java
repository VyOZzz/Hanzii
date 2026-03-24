package com.vy.hanzi.hanzi_srs_dictionary.repository;

import com.vy.hanzi.hanzi_srs_dictionary.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
