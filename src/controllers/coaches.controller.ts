import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coach } from '../entities/coach.entity';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Controller('coaches')
export class CoachesController {
  constructor(
    @InjectRepository(Coach)
    private readonly coachRepository: Repository<Coach>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() loginData: { username: string; password: string }) {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { username: loginData.username, password: loginData.password },
        relations: ['coaches'],
      });

      const token = this.jwtService.sign({ userId: user.id });

      return { success: true, user, token };
    } catch (error) {
    console.error('Error during login:', error);

    if (error instanceof HttpException) {
      throw error;
    }

  if (error.name === 'EntityNotFoundError') {
    throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
  }

  throw new HttpException('An error occurred during login', HttpStatus.INTERNAL_SERVER_ERROR);
}
}



  @Get()
  async listCoaches() {
    return await this.coachRepository.find();
  }

  @Get(':id')
  async getCoachById(@Param('id', ParseIntPipe) id: number) {
    return await this.coachRepository.findOneBy({id});
  }

  @Get(':id/students')
  async getCoachStudents(@Param('id') coachId: number) {
    try {
      const coach = await this.coachRepository.findOneOrFail({
        where: {
          id: coachId
        },
        relations: ['users']
      });
      const { name, ...coachInfo } = coach;
      return { coach: { name, ...coachInfo }};
    } catch (error) {
      throw new HttpException('Coach not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post(':id/connect')
@UseGuards(AuthGuard('jwt'))
async connectToCoach(
  @Param('id', ParseIntPipe) coachId: number,
  @Req() request: any,
) {
  try {
    const userId = request.user.id;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['coaches'], // Assuming you have a relationship named 'coaches' in your User entity
    });


    const isConnected = user.coaches.some(coach => coach.id === coachId);
    if (isConnected) {
      throw new HttpException('Already connected to this coach', HttpStatus.BAD_REQUEST);
    }

    const coach = await this.coachRepository.findOne({ where: { id: coachId } });

    user.coaches.push(coach);
    await this.userRepository.save(user);

    return { success: true, message: 'Connected to coach successfully.', user };
  } catch (error) {
    console.error('Error connecting to coach:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException('Failed to connect to coach', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

}

