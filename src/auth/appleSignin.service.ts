import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { JwtService } from "@nestjs/jwt";
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from "@nestjs/typeorm";
import { AppleTokenDTO } from "./dto/apple-email.dto";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateAppleUserDTO } from "./dto/user.dto";
import { AuthService } from "./auth.service";
import { Users } from "src/domain/user.entity";


@Injectable()
export class AppleSigninService{
    constructor(
        @InjectRepository(UserRepository)
        private userRepository : UserRepository,
        private jwtService :  JwtService,
        private userService : UserService,
        private authService : AuthService,
    ){}

    // DB에서 유저 조회 후 저장 및 update
    async verifyUser(appleUserDTO: CreateAppleUserDTO): Promise<any>{
        const userFind: Users = await this.userService.find_ByFields({
            where: { email: appleUserDTO.email}
        })

        const date = new Date();
        date.setHours(date.getHours() + 702*3);

        const newExpired = date;
        const newAccessToken = await this.authService.createJWT(appleUserDTO.email);

        // DB에 저장되어 있지 유저라면 email 저장
        if(!userFind){
            const newEmail = appleUserDTO.email;
            await this.userRepository.save({email: newEmail});
        }
        // DB에 저장되어 있는 유저인 경우 expired_date과 accesstoken을 갱신하기
        else{
            // await this.authService.validateJWT(userFind.accessToken); // 인가에 사용
            this.userRepository.update({email : userFind.email}, {
                expiredAt : newExpired, accessToken : newAccessToken
            });
        }
        return newAccessToken;
    }

    // apple id_token의 payload로부터 Email 추출
    async getDecodedEmail(appleIdToken: AppleTokenDTO): Promise<string>{
        const decodedToken = jwt.decode(appleIdToken.token, { complete: true }) as {
            header: { kid: string; alg: jwt.Algorithm };
            payload: { sub: string };
        }
        // decodedToekn 오류 처리 필요

        console.log('decoded Token : ', decodedToken);
        console.log('email : ', decodedToken.payload["email"]);

        const decodedEmail = decodedToken.payload["email"];
        const decodedEmailVerified =decodedToken.payload["email_verified"];
        if(decodedEmailVerified != 'true'){
            throw new BadRequestException('인증되지 않은 이메일입니다.');
        }

        return decodedEmail;
    }

    // 애플 로그인 (decoding한 email을 이용한 JWT 생성)
    async createToken(decodedEmail): Promise<{accessToken: string} | undefined>{
        // 새로운 jwt 토큰의 payload 생성
        const payload = decodedEmail;
        return {
            accessToken: this.jwtService.sign(payload)
        };
    }
}