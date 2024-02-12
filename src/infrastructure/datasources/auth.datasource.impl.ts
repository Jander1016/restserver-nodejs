import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDatasource, CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { UserMapper } from "../mappers/user.mapper";

type HashFunction = (password: string)=> string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {

  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
  ){}
 
  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {

    const { name, email, password } = registerUserDto

    try {

      const existEmail = await UserModel.findOne({ where: { email } })
      if(existEmail) throw CustomError.badRequest('User alredy exists')

      const user = await UserModel.create({ name, email, password : this.hashPassword(password)})

      //hash passw
      await user.save()

      // ToDo: falta mapper respuesta
      return UserMapper.userEntityFromObject(user)
      
    } catch (error) {
      if( error instanceof CustomError) throw error
      throw CustomError.internalServer
    }

  }
}