import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { getNowDate } from 'src/commons/utils/date.util';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    ///////////////////////////////////////////////////////////////////
    // 조회 //

    /**
     * 전체 조회
     * @returns 조회된 회원 정보 목록
     */
    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find({});
    }

    /**
     * ID 기반 회원 조회
     * @param userID
     * @returns 회원 정보
     */
    async findOneByID(
        userID: string, //
    ): Promise<UserEntity> {
        return await this.userRepository.findOne({
            where: { id: userID },
        });
    }

    /**
     * Email 기반 회원 조회
     * @param email
     * @returns 회원 정보
     */
    async findOneByEmail(
        email: string, //
    ): Promise<UserEntity> {
        return await this.userRepository.findOne({
            where: { email: email },
        });
    }

    ///////////////////////////////////////////////////////////////////
    // 생성 //

    create(
        entity: Partial<UserEntity>, //
    ): UserEntity {
        return this.userRepository.create(entity);
    }

    async save(
        entity: Partial<UserEntity>, //
    ): Promise<UserEntity> {
        return await this.userRepository.save(entity);
    }

    ///////////////////////////////////////////////////////////////////
    // 수정 //

    async updatePwd(
        userID: string,
        pwd: string, //
    ): Promise<UpdateResult> {
        return await this.userRepository.update(
            { id: userID },
            {
                pwd: pwd,
                logoutAt: getNowDate(),
                isLogin: false,
            },
        );
    }

    async login(
        userID: string, //
    ): Promise<UpdateResult> {
        return await this.userRepository.update(
            { id: userID },
            {
                loginAt: getNowDate(),
                isLogin: true,
            },
        );
    }

    async logout(
        userID: string, //
    ): Promise<UpdateResult> {
        return await this.userRepository.update(
            { id: userID },
            {
                logoutAt: getNowDate(),
                isLogin: false,
            },
        );
    }

    async restore(
        userID: string, //
    ): Promise<UpdateResult> {
        return await this.userRepository.restore({ id: userID });
    }

    ///////////////////////////////////////////////////////////////////
    // 삭제 //

    async softDelete(
        userID: string, //
    ): Promise<UpdateResult> {
        return await this.userRepository.update(
            { id: userID },
            {
                deleteAt: getNowDate(),
                isLogin: false,
                logoutAt: getNowDate(),
            },
        );
    }
}
