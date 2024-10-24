package com.dhyan.webauthTest.UserData;

import com.dhyan.webauthTest.Users.Users;
import com.yubico.webauthn.data.ByteArray;
import com.yubico.webauthn.data.UserIdentity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique = true)
    private String userName;

    @Column(nullable = false)
    private String displayName;

    @Column(nullable = false,length = 64)
    private ByteArray handle;

    @OneToOne
    @JoinColumn(name = "user_id")
    private Users users;

    public AppUser(UserIdentity user){
        this.handle=user.getId();
        this.userName=user.getName();
        this.displayName=user.getDisplayName();
    }

    public UserIdentity toUserIdentity(){
        return UserIdentity.builder()
                .name(getUserName())
                .displayName(getDisplayName())
                .id(getHandle())
                .build();
    }
}
