import { CustomRepository } from "src/db/typeorm-ex.module";
import { User } from "src/domain/user.entity";
import { Repository } from "typeorm";

@CustomRepository(User)
export class UserRepository extends Repository<User>{}
