/**
 * 상품 카테고리 Entity
 * depth 0
 */

import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
    Entity,
    Column,
    Tree,
    TreeChildren,
    TreeParent,
    PrimaryGeneratedColumn,
    BaseEntity,
    CreateDateColumn,
} from 'typeorm';

@Tree('closure-table')
@Entity({ name: 'product_category' })
@ObjectType({ description: '상품 분류 Entity' })
export class ProductCategoryEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column()
    @Field(
        () => String, //
        { description: '분류 이름' },
    )
    name: string;

    @TreeChildren({ cascade: true })
    @Field(
        () => [ProductCategoryEntity], //
        {
            nullable: true,
            description: '하위 분류',
        },
    )
    children: ProductCategoryEntity[];

    @TreeParent()
    @Field(() => ProductCategoryEntity, {
        nullable: true,
        description: '상위 분류',
    })
    parent: ProductCategoryEntity;

    @CreateDateColumn()
    createAt: Date;

    // @Column({ name: 'parentId', type: 'uuid', nullable: true })
    // parentId: string;
}
