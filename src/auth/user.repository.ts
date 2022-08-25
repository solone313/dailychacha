import { CustomRepository } from "src/db/typeorm-ex.module";
import { EntityRepository, Repository } from "typeorm";
import { User } from "./entity/user.entity";

@CustomRepository(User)
export class UserRepository extends Repository<User>{}
