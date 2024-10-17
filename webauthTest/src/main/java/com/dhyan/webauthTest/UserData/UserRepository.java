package com.dhyan.webauthTest.UserData;

import com.yubico.webauthn.data.ByteArray;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<AppUser,Long> {
    AppUser findByUserName(String name);
    AppUser findByHandle(ByteArray handle);
}
