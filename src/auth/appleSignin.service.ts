import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { AppleService } from "./apple.service";
import { AppleTokenDTO } from "./dto/apple-email.dto";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { BadRequestException } from '@nestjs/common';
import { UserDTO } from "./dto/user.dto";
import { AppleUserDTO } from "./dto/appleUser.dto";

@Injectable()
export class AppleSigninService{
    constructor(
        @InjectRepository(UserRepository)
        private userRepository : UserRepository,
        private appleService : AppleService,
        private jwtService :  JwtService,
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

    // apple id_token의 payload로부터 Email 추출
    async getDecodedEmail(appleIdToken: AppleTokenDTO): Promise<string>{
        const applePayload = await this.appleService.verifyAppleToken(appleIdToken.token); // 디코딩된 apple의 payload
        const decodedEmail = applePayload.email;
        const decodedEmailVerified = applePayload.email_verified;
        if(decodedEmailVerified != 'true'){
            throw new BadRequestException('인증되지 않은 이메일입니다.');
        }

        // 등록 되어 있지 않은 유저라면 DB에 추가 (처음 로그인하는 경우)
        console.log(await this.verifyUser({"email" : decodedEmail}));

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