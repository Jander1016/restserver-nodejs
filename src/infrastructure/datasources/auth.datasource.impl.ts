import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDatasource, CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { UserMapper } from "../mappers/user.mapper";

type HashFunction = (password: string)=> string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {

  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
  ){}
 
  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {

    const { name, email, password } = registerUserDto;

    try {

      const existEmail = await UserModel.findOne({ email })
      if(existEmail) throw CustomError.badRequest('User alredy exists');

      const user = await UserModel.create({ name, email, password : this.hashPassword(password)})

      await user.save()

      return UserMapper.userEntityFromObject(user)
      
    } catch (error) {
      if( error instanceof CustomError) throw error
      throw CustomError.internalServer
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {

    const { email, password } = loginUserDto;

    try {

      const user = await UserModel.findOne({ email })
      if(!user) throw CustomError.badRequest('User not found');

      const isValid = this.comparePassword(password, user.password)
      if(!isValid) throw CustomError.badRequest('Invalid password');

      return UserMapper.userEntityFromObject(user)

    } catch (error) {
      if( error instanceof CustomError) throw error
      throw CustomError.internalServer
    }

  }
}