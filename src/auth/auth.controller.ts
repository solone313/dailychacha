import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AppleSigninService } from './appleSignin.service';
import { AuthService } from './auth.service';
import { AppleTokenDTO } from './dto/apple-email.dto';
import { UserDTO } from './dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private appleSigninService: AppleSigninService
        ){}

     // 회원가입
    @Post('/sign-up') 
    async signup(
        @Req() req: Request, @Body() userDTO: UserDTO): Promise<UserDTO>{
            return await this.authService.registerUser(userDTO);
        } 

    // 로그인
    @Post('/sign-in')
    async signin(@Body() userDTO: UserDTO, @Res() resp: Response): Promise<any>{
        const jwt = await this.authService.validateUser(userDTO);
        resp.setHeader('Authorization', 'Bearer '+jwt);
        return resp.json(jwt); // 로그인 시 토큰 리턴
    }

    // 애플 로그인
    @Post('/apple-sign-in')
    async appleSignin(@Body() appleIdToken: AppleTokenDTO, @Res() resp: Response): Promise<any>{
        const decodedEmail = await this.appleSigninService.getDecodedEmail(appleIdToken); // 디코딩된 email claim 추출
        // 등록 되어 있지 않은 유저라면 DB에 추가 (처음 로그인하는 경우)
        // accessToken, exp DB에 추가
        const jwt = await this.appleSigninService.verifyUser({
            email : decodedEmail,
            access_token : appleIdToken.token
        });
        resp.setHeader('Authorization', 'Bearer '+jwt);
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
    getUser(@Req() req: Request, @Res() resp: Response):any{
        const user: any=req.user;

        return resp.json([{"email": user.email, "user_id":user.user_id}]);
    }
}