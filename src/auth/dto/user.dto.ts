export class UserDTO{
    email: string;
    password: string;
}

export class CreateUserDTO{
    email: string;
    password: string;
    access_token: string;
    expired_at : Date;
}

export class UpdateUserDTO extends CreateUserDTO{
}

export class CreateAppleUserDTO{
    email: string;
    access_token: string;
}