import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from "@nestjs/passport";
import { JWtPayload } from "./interface/jwt-payload.interface";

@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'abshbcgdnuns725387$#%2hxthfu',
        })
    }

    async validate(payload: JWtPayload) {
    return { userId: payload.sub, username: payload.username };
  }
}