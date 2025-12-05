import { Body, Controller, Get, Inject, Optional, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {

  /* constructor(private readonly userService:UserService) {}  */// constructor injection
  
  //@Optional() // if we are not provide UserService into @Inject without this @Optional decorator our dependecies are not resolved and server is down 
  @Inject(UserService) 
  private readonly userService: UserService // property based injection


  @Get()
  public getInfo() {
    return this.userService.getInfo();
  }


  @Post('create')
  public create (@Body() dto:CreateUserDto) {
    return this.userService.create(dto)
  }

}
