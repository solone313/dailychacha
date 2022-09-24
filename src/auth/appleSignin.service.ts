import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { JwtService } from "@nestjs/jwt";
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from "@nestjs/typeorm";
import { AppleTokenDTO } from "./dto/apple-email.dto";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { BadRequestException } from '@nestjs/common';
import { CreateAppleUserDTO, UserDTO } from "./dto/user.dto";

@Injectable()
export class AppleSigninService{
    constructor(
        @InjectRepository(UserRepository)
        private userRepository : UserRepository,
        private jwtService :  JwtService,
        private userService : UserService,
    ){}

    // DB에서 유저 조회 후 저장 및 update
    async verifyUser(appleUserDTO: CreateAppleUserDTO): Promise<any>{
        const userFind: UserDTO = await this.userService.find_ByFields({
            where: { email: appleUserDTO.email}
        })
        // DB에 저장되어 있지 유저라면
        if(!userFind){
            console.log(appleUserDTO.email, ' DB 에 저장완료 ');
            const date = new Date();
            date.setHours(date.getHours()+720*3);
            console.log( {
                email : appleUserDTO.email,
                expired_at : date,  
                access_token : appleUserDTO.access_token
            });
            return this.userRepository.save(
                {
                    email : appleUserDTO.email,
                    expired_at : date,  
                    access_token : appleUserDTO.access_token
                });
            }
        // 이미 이메일이 존재하는 경우
        return true;
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

        // 등록 되어 있지 않은 유저라면 DB에 추가 (처음 로그인하는 경우)
        // accessToken, exp DB에 추가
        console.log(await this.verifyUser({ email : decodedEmail, access_token : appleIdToken.token }));

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