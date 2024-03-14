import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachesController } from '../controllers/coaches.controller';
import { Coach } from '../entities/coach.entity';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coach, User]),
    JwtModule.register({
      secret: 'abshbcgdnuns725387$#%2hxthfu',
      signOptions: { expiresIn: '1h' },
    })
  ],
  controllers: [CoachesController],
})
export class CoachesModule {}
