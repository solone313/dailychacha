import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions } from "typeorm";
import { UserDTO } from "./dto/user.dto";
import { UserRepository } from "./user.repository";
import * as bcrypt from 'bcrypt';
import { AppleUserDTO } from "./dto/appleUser.dto";
import { Users } from "src/domain/user.entity";

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        ){}

        // 등록이 된 유저인지 확인
        async findByFields(options: FindOneOptions<UserDTO>): Promise<Users | undefined>{
            return await this.userRepository.findOne(options);
        }

        async find_ByFields(options: FindOneOptions<AppleUserDTO>): Promise<Users | undefined>{
            return await this.userRepository.findOne(options);
        }


        // 신규 유저 등록
        async save(userDTO: UserDTO): Promise<UserDTO | undefined>{
            await this.transformPassword(userDTO);
            console.log(userDTO);
            return this.userRepository.save(userDTO);
        }

        // 비밀번호 암호화 (saltround를 10으로 지정)
        async transformPassword(user: UserDTO): Promise<void>{
            user.password = await bcrypt.hash(
                user.password, 10,
            );
            return Promise.resolve();
            }

        // 삭제하기
        async deleteToken(user: Users): Promise<any>{
            const result =  this.userRepository.update(user.id,{
                accessToken: null,
                expiredAt: null,
            })

            if ((await result).affected === 0 ){
                throw new NotFoundException();
            }
        }

        // 회원 탈퇴
        async remove(user: Users): Promise<any>{
            const result = this.userRepository.delete(user.id);
            if((await result).affected === 0){
                throw new NotFoundException();
            }
        }
    }

