import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('employee')
export class EmployeeController {
  constructor(private authService: EmployeeService) {}

  @Get()
  public async getAll() {
    return this.authService.findAll();
  }

  @Delete(':id')
  public async Delete(@Param('id') id: number) {
    return this.authService.delete(id);
  }

  @Post('signup')
  public async signUp(@Body() fields: any) {
    return this.authService.signupasemployee(fields);
  }

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  public async signIn(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  public async getProfile(@Request() req) {
    return req.user;
  }

  @Get(':id')
  public async getOne(@Param('id') id: number) {
    return this.authService.findOne(id);
  }
}
