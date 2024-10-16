package com.dhyan.webauthTest.Utility;

import com.yubico.webauthn.data.ByteArray;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ByteArrayAttributeConverter implements AttributeConverter<ByteArray,byte[]> {

    @Override
    public byte[] convertToDatabaseColumn(ByteArray attribute) {
        return new byte[0];
    }

    @Override
    public ByteArray convertToEntityAttribute(byte[] dbData) {
        return null;
    }
}
