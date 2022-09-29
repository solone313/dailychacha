import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private authService:AuthService){
        super({
            // auth header의 bearer Token(JWT) 추출
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'SECRET'
        })
    }

    // 토큰 검증
    async validate(accessToken: string, done: VerifiedCallback): Promise<any>{
        const user = await this.authService.validateJWT(accessToken);
        if (!user){
            return done(new UnauthorizedException({message: '존재하지 않는 사용자입니다.'}));
        }
        return done(null, user);
    }
}
