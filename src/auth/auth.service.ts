import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/domain/user.entity';
import { SigninPayload } from './security/payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private userService:UserService,
        private jwtService: JwtService,
    ){}

    // 새로운 유저 등록
    async registerUser(newUser:UserDTO): Promise<UserDTO>{
        // 이미 등록되어 있는 이메일이 있는지 탐색
        const userFind: UserDTO = await this.userService.findByFields({
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
        const userFind: Users = await this.userService.findByFields({
            where: { email : userDTO.email }
        })
        if(!userFind){  // 해당 이메일로 가입된 유저가 없는 경우
            throw new UnauthorizedException("로그인 실패");
        }

        // validate password (bcrypt)
        const validatePassword = await bcrypt.compare(userDTO.password, userFind.password);
        if(!validatePassword ){ // 비밀번호가 올바르지 않은 경우
            throw new UnauthorizedException('올바르지 않은 비밀번호');
        }
        
        return {
            accessToken: await this.createJWT(userFind.email)
        };
    }


    // create JWT (payload claim : email, expired_at)
    async createJWT(email : string) : Promise<string>{
        const date = new Date();
        date.setHours(date.getHours() + 720 * 3);

        console.log('date value : ', date.valueOf());
        // user email과 expired_date payload 설정
        const payload: SigninPayload = {
            email : email,
            exp : date.valueOf()
        };

        return this.jwtService.sign(payload);
    } 


    // 유저의 토큰 검증
    async validateJWT(accessToken : string): Promise<Users | undefined>{
        console.log('accessToken : ', accessToken)
        const userFind : Users = await this.userService.findByFields({
            where : { email : accessToken['email'] }
        })

        if(!userFind){  // 해당 이메일로 가입된 유저가 없는 경우
            throw new UnauthorizedException("로그인 실패");
        }

        // expired_date이 현재 날짜보다 지났다면 다시 로그인 필요
        if (accessToken['exp'] < new Date().valueOf()){
            throw new UnauthorizedException("다시 로그인이 필요합니다.");
        }
        return userFind;
    }

    // 로그아웃
    async signOut(user : Users){
        await this.userService.deleteToken(user);
    }

    // 탈퇴
    async deleteInfo(user: Users){
        await this.userService.remove(user);
    }

}