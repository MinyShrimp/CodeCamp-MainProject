import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../user.service';
import { UserCheckService } from '../userCheck.service';
import { MockUserRepository } from './user.repository.mock';

describe('UserService', () => {
    let userService: UserService;
    let userCheckService: UserCheckService;
    let userRepository: MockUserRepository;

    beforeEach(async () => {
        const userModule = await Test.createTestingModule({
            imports: [],
            providers: [
                {
                    provide: getRepositoryToken(UserEntity),
                    useClass: MockUserRepository,
                },
                UserService,
                UserCheckService,
            ],
        }).compile();

        userRepository = userModule.get<MockUserRepository>(
            getRepositoryToken(UserEntity),
        );
        userService = userModule.get<UserService>(UserService);
        userCheckService = userModule.get<UserCheckService>(UserCheckService);
    });

    describe('create', () => {
        it('Overlap Email', async () => {
            const userRepositorySpyFindOne = jest.spyOn(
                userRepository,
                'findOne',
            );
            const userRepositorySpySave = jest.spyOn(userRepository, 'save');

            await userService.createUser({
                name: '김수한무',
                email: 'ksk7584@gmail.com',
                pwd: 'qwer1234!',
            });

            try {
                await userService.createUser({
                    name: '김수한무',
                    email: 'ksk7584@gmail.com',
                    pwd: 'qwer1234!',
                });
            } catch (error) {
                expect(error).toBeInstanceOf(ConflictException);
            }

            expect(userRepositorySpyFindOne).toBeCalledTimes(2);
            expect(userRepositorySpySave).toBeCalledTimes(1);
        });

        it('Signup', async () => {
            const userRepositorySpyFindOne = jest.spyOn(
                userRepository,
                'findOne',
            );
            const userRepositorySpySave = jest.spyOn(userRepository, 'save');

            const result = await userService.createUser({
                name: '김수한무',
                email: 'ksk7774@gmail.com',
                pwd: 'qwer1234!',
            });

            expect({ name: result.name, email: result.email }).toStrictEqual({
                name: '김수한무',
                email: 'ksk7774@gmail.com',
            });

            expect(userRepositorySpyFindOne).toBeCalledTimes(1);
            expect(userRepositorySpySave).toBeCalledTimes(1);
        });
    });

    describe('findOne', () => {
        // const user = await userService.findOneByEmail('');
    });
});
