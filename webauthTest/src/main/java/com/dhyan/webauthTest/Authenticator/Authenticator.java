package com.dhyan.webauthTest.Authenticator;

import com.dhyan.webauthTest.UserData.AppUser;
import com.yubico.webauthn.RegistrationResult;
import com.yubico.webauthn.data.AttestedCredentialData;
import com.yubico.webauthn.data.AuthenticatorAttestationResponse;
import com.yubico.webauthn.data.ByteArray;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

@Entity
@Data
@NoArgsConstructor
public class Authenticator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    private String name;

    @Column(nullable = false)
    private ByteArray credentialId;

    @Column(nullable = false)
    private ByteArray publicKey;

    @ManyToOne
    private AppUser user;

    @Column(nullable = false)
    private Long count;

    @Column(nullable = true)
    private ByteArray aaguid;

    public Authenticator(RegistrationResult result,
                         AuthenticatorAttestationResponse response,
                         AppUser user,
                         String name){
        Optional<AttestedCredentialData> attestationData = response.getAttestation()
                .getAuthenticatorData()
                .getAttestedCredentialData();

        this.credentialId=result.getKeyId().getId();
        this.publicKey=result.getPublicKeyCose();
        attestationData.ifPresent(data -> this.aaguid = data.getAaguid());
        this.count=result.getSignatureCount();
        this.name=name;
        this.user=user;
    }
}
