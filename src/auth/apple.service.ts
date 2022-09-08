import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { BadRequestException } from '@nestjs/common';

interface AppleJwtTokenPayload {
    iss: string;
    aud: string;
    exp: number;
    iat: number;
    sub: string;
    nonce: string;
    c_hash: string;
    email?: string;
    email_verified?: string;
    is_private_email?: string;
    auth_time: number;
    nonce_supported: boolean;
  }

export class AppleService{
    
    async verifyAppleToken(appleIdToken: string): Promise<AppleJwtTokenPayload> {
        // id_token 디코딩
        const decodedToken = jwt.decode(appleIdToken, { complete: true }) as {
            header: { kid: string; alg: jwt.Algorithm };
            payload: { sub: string };
        };

        const keyIdFromToken = decodedToken.header.kid;

        const applePublicKeyUrl = 'https://appleid.apple.com/auth/keys';

        const jwksClient = new JwksClient({ jwksUri: applePublicKeyUrl });

        const key = await jwksClient.getSigningKey(keyIdFromToken); // header의 kid로 signinKey 가져옴
        const publicKey = key.getPublicKey(); // signinKey에서 publicKey 추출

        // appleIdToken과 publicKey로 id_token을 검증
        const verifiedDecodedToken: AppleJwtTokenPayload = jwt.verify(appleIdToken, publicKey, {
            algorithms: [decodedToken.header.alg]
        }) as AppleJwtTokenPayload;

        return verifiedDecodedToken; // 검증된 토큰의 payload 반환
    }
}

export class AppleSigninService{
    constructor(
        private appleService : AppleService,
        private jwtService : JwtService
    ){}

    // apple id_token의 payload로부터 Email 추출
    async getDecodedEmail(appleIdToken: string): Promise<string>{
        console.log('apple id token : ' , appleIdToken);
        const applePayload = await this.appleService.verifyAppleToken(appleIdToken); // 디코딩된 apple의 payload
        
        console.log(applePayload);

        const decodedEmail = applePayload.email;
        const decodedEmailVerified = applePayload.email_verified;
        if(decodedEmailVerified != 'true'){
            throw new BadRequestException('인증되지 않은 이메일입니다.');
        }

        return decodedEmail;
    }

    // 애플 로그인 (decoding한 email을 이용한 JWT 생성)
    async createToken(decodedEmail): Promise<{accessToken: string} | undefined>{
        // 새로운 jwt 토큰의 payload 생성
        const payload = decodedEmail;
        console.log('payload : ', payload);
        return {
            accessToken: this.jwtService.sign(payload)
        };
    }
}
