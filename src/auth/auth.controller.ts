import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserDTO } from './dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

     // 회원가입
    @Post('/sign-up') 
    async signup(
        @Req() req: Request, @Body() UserDTO: UserDTO): Promise<UserDTO>{
            return await this.authService.registerUser(UserDTO);
        } 

    // 로그인
    @Post('/sign-in')
    async signin(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any>{
        const jwt = await this.authService.validateUser(userDTO);
        res.setHeader('Authorization', 'Bearer '+jwt.accessToken);
        return res.json(jwt); // 로그인 시 토큰 리턴
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
