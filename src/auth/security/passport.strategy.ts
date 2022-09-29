import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { Users } from "src/domain/user.entity";
import { UserService } from "../user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private userService : UserService){
        super({
            // auth header의 bearer Token(JWT) 추출
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'SECRET'
        })
    }

    // 토큰 검증 (accessToken: decoded payload)
    async validate(accessToken: string, done: VerifiedCallback): Promise<any>{
        const user: Users = await this. userService.findByFields({
            where: { email : accessToken['email'] }
        })

        if (!user){
            return done(new UnauthorizedException({message: '존재하지 않는 사용자입니다.'}));
        }
        
        // AccessToken의 exp와 현재 시각을 비교 (UTC 기준)
        if ( accessToken['exp'] < new Date().valueOf() ){
            console.log('Token expired at : ', new Date(accessToken['exp']).toUTCString());
            throw new UnauthorizedException('Token Expired'); // 재 로그인 필요
        }
        return done(null, user);
    }
}
