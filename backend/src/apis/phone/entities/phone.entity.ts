import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'src/apis/user/entities/user.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'phone' })
@ObjectType({ description: '저자 Entity' })
export class PhoneEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @Field(() => String)
    phone: string;

    @Column()
    @Field(() => String)
    token: string;

    @CreateDateColumn()
    createAt: Date;

    @OneToOne(
        () => UserEntity, //
        (user) => user.phoneAuth,
        { cascade: true, onDelete: 'CASCADE' },
    )
    user: UserEntity;
}
