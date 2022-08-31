import { BadRequestException, Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, response, Response } from 'express';
import { AppleService, AppleSigninService } from './apple.service';
import { AuthService } from './auth.service';
import { AppleEmailDTO } from './dto/apple-email.dto';
import { UserDTO } from './dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private appleService: AppleService,
        private appleSigninService: AppleSigninService
        ){}

     // 회원가입
    @Post('/sign-up') 
    async signup(
        @Req() req: Request, @Body() UserDTO: UserDTO): Promise<UserDTO>{
            return await this.authService.registerUser(UserDTO);
        } 

    // 로그인
    @Post('/sign-in')
    async signin(@Body() userDTO: UserDTO, @Res() resp: Response): Promise<any>{
        const jwt = await this.authService.validateUser(userDTO);
        resp.setHeader('Authorization', 'Bearer '+jwt.accessToken);
        return resp.json(jwt); // 로그인 시 토큰 리턴
    }

    // 애플 로그인
    @Post('/apple-sign-in')
    async appleSignin(@Body() appleDTO: AppleEmailDTO, @Res() resp: Response): Promise<any>{
        const decodedEmail = this.appleSigninService.getDecodedEmail(appleDTO); // 디코딩된 email claim 추출
        const jwt = await this.appleSigninService.validateUser(decodedEmail); // jwt 토큰 생성
        resp.setHeader('Authorization', 'Bearer '+jwt.accessToken);
        return resp.json(jwt);
    }

    // 토큰 인증 확인
    @Get('/authenticate')
    @UseGuards(AuthGuard())
    isAuthenticated(@Req() req: Request): any {
        const user: any = req.user;
        return user;
    }

    // 유저 정보 가져오기
    @Get('/user')
    @UseGuards(AuthGuard())
    getUser(@Req() req: Request):any{
        const user: any=req.user;
        return user;
    }
}
