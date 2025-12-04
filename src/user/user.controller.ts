import { Controller, Get, HttpCode, Next, Req, Res , Header , type HttpRedirectResponse, Redirect, Param, HostParam, Post, Body, Query} from '@nestjs/common';
import { UserService } from './user.service';
import type { NextFunction, Request, Response } from 'express';
import { Observable, of } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user') /* 1.1  чекни README*/
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Get('standard') // 1.2
  public findAll(): number {
    return 2 // 1.3
  }

  @Get('library-specific')
  public findAllSpec(@Res() response: Response) {
    response.set('Content-Type', 'text/html')
    response.send({
      name: "Alex"  // 1.3
    })
  }

  @Post('create')
  public create (@Body() dto: CreateUserDto) { // dto потрібно щоб встановити (типу поля) як саме ми будемо передавати об'єкт через мережу
    // для DTO використовуємо саме класс бо він не перетворються в бог знай що під час трансплінгу. Цей важливо наприклад з такими фічами Pipes бо вони покладаються на метатипи змінніх у runtime які достпуні лише у класів 
  }




  @Get('combine')
  public findAllCombine(@Res({ passthrough: true }) response: Response, @Next() next: NextFunction) {
    response.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true }) // 1.4
    const user = { name: "Alex" };
    return user // 1.4
  }

  // Використовуємо @Request() — повний req-об’єкт

  @Get('full-request')
  public getFullRequest(@Req() request: Request) {
    return {
      method: request.method,
      url: request.url,
      baseUrl: request.baseUrl,
      originalUrl: request.originalUrl,
      headers: request.headers,
      ip: request.ip,
      cookies: request.cookies,
      query: request.query,
      params: request.params,
      protocol: request.protocol,
    };
  }

  @Get('status-code')
  @HttpCode(204) // 1.5
  public testingStatusCode () {
    return 'penis' 
  }


  @Get('headers')
  @Header('Cache-Control', 'no-store') // просто встановлюєш header 
  public getHeaders(@Req() request : Request) {
    request.header("set-cookie") //  уразі необхідності використовуєш (це library specific mode) @Req() request.header()
    return {
      penis:'Gvan'
    };
  }

  @Get('cringe-redirect')
  @Redirect('https://nestjs.com', 301) // приймає 2 параметри обидва опціональні (url, statusCode) але так скажу без них й сенсу в редіректі немає 
  public regularRedirect () {
    return {
      url:"https://gemini.google.com/app?hl=uk" // Дивись якщо ти повертаєш об'єкт з посиланням то значення твого  @Redirect декоратора перевизначається
    }
  }

   @Get('dynamic')
  public dynamicRedirect(): HttpRedirectResponse { // цей тип HttpRedirectResponse дозволяє динмаічно зробити redirect  або встановити статус код.
    
    const userLoggedIn = Math.random() > 0.5; // умовна логіка

    const url = userLoggedIn 
      ? '/dashboard'
      : '/login';

    const statusCode = userLoggedIn
      ? 302   
      : 307;  

    return {
      url,
      statusCode, // Для цього потрібно просто повернути об'єкт з властивостями  url, statusCode
    };
  }


  // Маршрути з параметрами слід оголошувати після будь-яких статичних шляхів. Це запобігає тому, щоб параметризовані шляхи перехоплювали трафік, 
  // призначений для статичних шляхів.

  @Get('host')
  public getHost(@HostParam('hostParam') hp: string) {
    return {
      hostParam: hp,
    };
  }

  @Get()
findAllObserver(): Observable<any[]> { // ну шо сказать можно rxjs юзать для какихто кесов
  return of([]);
} 


  @Get('search-combined')
public searchCombined(
  @Query('age') age: number,
  @Query('role') role: string,
  @Query('tags') tags: string[],
  @Query() fullQuery: any,
) {
  return {
    age,
    role,
    tags,
    fullQuery,
  };
}


   @Get('profile/:id')
  public getById(
    @Param('id') id: string, 
  ) {
     return {
       id
     }
  }


  // State sharing 
  // Короче, у нас все практично передається через incoming request такие речі : database connection pool, singleton services with global state, і так далі.
  // Тут в чому питання полягає в інших мовах програмування використовується Multi-Threaded Stateless Model, простими словами на кожний requst среться поток  тому в цих 
  // мовах передавати все черезincoming request залупа тому що ти не можешь гарантивувати consistency. В нас Node.js це цілько безпечно 


  



}
