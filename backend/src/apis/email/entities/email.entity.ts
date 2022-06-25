import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from 'src/apis/user/entities/user.entity';

@Entity({ name: 'email' })
export class EmailEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    token: string;

    @Column({ default: false })
    isAuth: boolean;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @OneToOne(
        () => UserEntity, //
        (user) => user.email,
        { cascade: true, onDelete: 'CASCADE' },
    )
    user: UserEntity;
}
