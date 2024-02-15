import { JwtAdapter } from "../../../../config/jwt";
import { LoginUserDto } from "../../../dtos/auth/login-user.dto";
import { CustomError } from "../../../errors/custom.error";
import { AuthRepository } from "../../../repositories/auth.repository";

interface LoginUserUseCase{
    execute(loginUserDto: LoginUserDto): Promise<object>;
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class LoginUser implements LoginUserUseCase{

    constructor(
      private readonly authRepository: AuthRepository,
      private readonly signToken: SignToken = JwtAdapter.generateToken
      ){}

    async execute(loginUserDto: LoginUserDto): Promise<object>{

      const user = await this.authRepository.login(loginUserDto)
      
      if(!user) throw CustomError.badRequest('Invalid credentials');

      const token = await this.signToken({id: user.id}, '2h')
      if (!token) throw CustomError.internalServer('Error to generate token');
  
      
      return{
        token: token,
        user
      }
    }

}