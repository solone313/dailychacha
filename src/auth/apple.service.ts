import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { AppleUserDTO } from './dto/appleUser.dto';
import { UserDTO } from './dto/user.dto';

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

@Injectable()
export class AppleService{
    constructor(
        private userRepository : UserRepository,
        private userService : UserService,
    ){}

    async verifyUser(appleUserDTO: AppleUserDTO): Promise<any>{
        const userFind: UserDTO = await this.userService.find_ByFields({
            where: { email: appleUserDTO.email}
        })
        // DB에 저장되어 있지 유저라면
        if(!userFind){
            console.log(appleUserDTO.email, ' DB 에 저장완료 ');
            return this.userRepository.save({ "email" : appleUserDTO.email, "password" : null });
        }
        return true;
    }


    async verifyAppleToken(appleIdToken: string): Promise<AppleJwtTokenPayload> {

        const decodedToken = jwt.decode(appleIdToken, { complete: true }) as {
            header: { kid: string; alg: jwt.Algorithm };
            payload: { sub: string };
        };

        console.log('decoded Token : ', decodedToken);
        console.log('email : ', decodedToken.payload["email"]);
        const decodedEemail = decodedToken.payload["email"];

        await this.verifyUser({"email": decodedEemail});
        
        const keyIdFromToken = decodedToken.header.kid;
        
        const applePublicKeyUrl = 'https://appleid.apple.com/auth/keys';
        const jwksClient = new JwksClient({ jwksUri: applePublicKeyUrl });
        console.log('jwksClient : ' , jwksClient)

        const key = await jwksClient.getSigningKey(keyIdFromToken); // header의 kid로 signinKey 가져옴
        console.log('key : ', key);
        const publicKey = key.getPublicKey(); // signinKey에서 publicKey 추출

        // appleIdToken과 publicKey로 id_token을 검증
        try{
            return jwt.verify(appleIdToken, publicKey, {
                algorithms: [decodedToken.header.alg]
            }) as AppleJwtTokenPayload;
        }catch(err){
            if (err instanceof jwt.TokenExpiredError){
                throw new BadRequestException('다시 로그인이 필요합니다.(Token Expired)');
            }
        }
    }
}