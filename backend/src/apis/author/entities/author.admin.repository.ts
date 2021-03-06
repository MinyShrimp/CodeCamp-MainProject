import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { AuthorEntity } from './author.entity';

@Injectable()
export class AuthorAdminRepository {
    constructor(
        @InjectRepository(AuthorEntity)
        private readonly authorRepository: Repository<AuthorEntity>,
    ) {}

    private readonly _selector = [
        'author.id',
        'author.name',
        'author.description',
        'author.createAt',
        'author.updateAt',
    ];

    async findAll(): Promise<AuthorEntity[]> {
        return await this.authorRepository
            .createQueryBuilder('author')
            .select(this._selector)
            .withDeleted()
            .orderBy('author.createAt')
            .getMany();
    }

    async findAllNames(): Promise<AuthorEntity[]> {
        return await this.authorRepository
            .createQueryBuilder('author')
            .select(['author.id', 'author.name'])
            .withDeleted()
            .orderBy('author.createAt')
            .getMany();
    }

    async findOne(
        authorID: string, //
    ): Promise<AuthorEntity> {
        return await this.authorRepository
            .createQueryBuilder('author')
            .select([...this._selector, 'author.deleteAt'])
            .where('author.id=:id', { id: authorID })
            .withDeleted()
            .getOne();
    }

    async bulkDelete(
        IDs: Array<string>, //
    ): Promise<DeleteResult[]> {
        return await Promise.all(
            IDs.map((id) => {
                return this.authorRepository.delete({ id: id });
            }),
        );
    }
}
