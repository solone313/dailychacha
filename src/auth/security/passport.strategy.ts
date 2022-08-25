import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "../auth.service";
import { Payload } from "./payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private authService:AuthService){
        super({
            // jwt 토큰 분석
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: 'SECRET'
        })
    }

    // 토큰 검증
    async validate(payload: Payload, done: VerifiedCallback): Promise<any>{
        const user = await this.authService.tokenValidateUser(payload);
        if (!user){
            return done(new UnauthorizedException({message: '존재하지 않는 사용자입니다.'}));
        }
        return done(null, user);
    }
}