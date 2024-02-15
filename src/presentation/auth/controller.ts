import { Request, Response } from "express";
import {
  AuthRepository,
  CustomError,
  LoginUserDto,
  RegisterUser,
  RegisterUserDto,
} from "../../domain";
import { UserModel } from "../../data/mongodb";
import { LoginUser } from "../../domain/use-cases/auth/users/login.use-case";

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  private handlerError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  };

  registerUser = async (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    new RegisterUser(this.authRepository)
      .execute(registerUserDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handlerError(error, res));
  };

  loginUser = async (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.login(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    new LoginUser(this.authRepository)
      .execute(loginUserDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handlerError(error, res));
  };

  getUsers = (req: Request, res: Response) => {
    UserModel.find()
      .then(() =>
        res.json({
          user: req.body.user,
        })
      )
      .catch(() => res.status(400).json({ error: "Internal Server Error" }));
  };
}
