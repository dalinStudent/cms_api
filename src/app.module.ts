import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachesModule } from './modules/coaches.module';
import ormconfig from '../ormconfig';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    CoachesModule,
    JwtModule.register({
      secret: 'abshbcgdnuns725387$#%2hxthfu',
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule
  ],
})
export class AppModule {}
