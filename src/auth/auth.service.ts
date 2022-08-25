import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService:UserService,
        private jwtService: JwtService
    ){}

    // 새로운 유저 등록
    async registerUser(newUser:UserDTO): Promise<UserDTO>{
        // 이미 등록되어 있는 이메일이 있는지 탐색
        let userFind: UserDTO = await await this.userService.findByFields({
            where: {email: newUser.email}
        });
        // 탐색되었다면, Bad Request 오류 처리 (HTTP상태 코드 400)
        if(userFind){
            throw new HttpException('이미 사용되고 있는 유저입니다.', HttpStatus.BAD_REQUEST)
        }
        // 새로운 유저 정보 저장
        return await this.userService.save(newUser);
    }

    // 로그인
    async validateUser(userDTO: UserDTO): Promise<{accessToken: string} | undefined>{
        let userFind: User = await this.userService.findByFields({
            where: { email: userDTO.email}
        })
        const validatePassword = await bcrypt.compare(userDTO.password, userFind.password);

        // 사용자를 찾지 못한 경우와 비밀번호가 올바르지 않은 경우
        if(!userFind || !validatePassword ){
            throw new UnauthorizedException('로그인 실패');
        }

        const payload: Payload = { user_id: userFind.user_id, email: userFind.email };
        return {
            accessToken: this.jwtService.sign(payload)
        };
    }

    // 유저의 토큰 검증
    async tokenValidateUser(payload: Payload): Promise<User | undefined>{
        return await this.userService.findByFields({
            where: { email:payload.email }
        })
    }
}