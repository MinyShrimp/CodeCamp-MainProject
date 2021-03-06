import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';

// @EntityRepository(ProductEntity)
// export class ProductRepository extends Repository<ProductEntity> {
//     findAll = async (): Promise<ProductEntity[]> => {
//         console.log(this);
//         return await this.find({
//             relations: ['book', 'productCategory', 'productTags'],
//         });
//     };
// }

@Injectable()
export class ProductRepository {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>, //
    ) {}

    /**
     * 전체 상품 조회
     * @returns 모든 상품 목록
     */
    async findAll(): Promise<ProductEntity[]> {
        return await this.productRepository.find({
            relations: [
                'book',
                'book.publisher',
                'book.author',
                'book.book_images',
                'book.book_images.file',
                'productCategory',
                'productCategory.parent',
                'productCategory.parent.parent',
                'productCategory.parent.parent.parent',
                'productTags',
            ],
            order: {
                createAt: 'ASC',
            },
        });
    }

    async findListAll(): Promise<ProductEntity[]> {
        return await this.productRepository
            .createQueryBuilder('p')
            .select([
                'p.id',
                'p.name',
                'p.price',
                'p.stock_count',
                't.name',
                'c.name',
                'cp.name',
                'cpp.name',
                'cppp.name',
                'b.description',
                'i.isMain',
                'f.url',
                'a.name',
                'a.description',
                'pb.name',
                'pb.description',
            ])
            .leftJoin('p.productCategory', 'c')
            .leftJoin('p.productTags', 't')
            .leftJoin('c.parent', 'cp')
            .leftJoin('cp.parent', 'cpp')
            .leftJoin('cpp.parent', 'cppp')
            .leftJoin('p.book', 'b')
            .leftJoin('b.author', 'a')
            .leftJoin('b.publisher', 'pb')
            .leftJoin('b.book_images', 'i')
            .leftJoin('i.file', 'f')
            .orderBy('p.createAt')
            .getMany();
    }

    /**
     * 삭제된 데이터를 포함한 모든 상품 조회
     * @returns 삭제된 데이터를 포함한 모든 상품 목록
     */
    async findAllWithDeleted(): Promise<ProductEntity[]> {
        return await this.productRepository.find({
            relations: ['book', 'productCategory', 'productTags'],
            withDeleted: true,
        });
    }

    /**
     * 묶음 상품 조회
     * @returns 모든 상품 목록
     */
    async findAllByIds(
        ids: string[], //
    ): Promise<ProductEntity[]> {
        return await this.productRepository.findByIds(ids, {
            relations: ['book', 'productCategory', 'productTags'],
        });
    }

    /**
     * 단일 상품 조회
     * @param productID
     * @returns 단일 상품
     */
    async findOneByID(
        productID: string, //
    ): Promise<ProductEntity> {
        return await this.productRepository.findOne({
            where: { id: productID },
            relations: ['book', 'productCategory', 'productTags'],
        });
    }

    /**
     * 삭제된 데이터를 포함한 단일 상품 조회
     * @param productID
     * @returns 삭제된 데이터를 포함한 단일 상품
     */
    async findOneWithDeleted(
        productID: string, //
    ): Promise<ProductEntity> {
        return await this.productRepository.findOne({
            where: { id: productID },
            relations: ['book', 'productCategory', 'productTags'],
            withDeleted: true,
        });
    }

    /**
     * 상품 생성
     * @param product
     * @returns 생성된 상품 정보
     */
    async save(
        product: Partial<ProductEntity>, //
    ): Promise<ProductEntity> {
        return await this.productRepository.save(product);
    }

    /**
     * 삭제 취소
     * @param productID
     * @returns
     */
    async retoreByID(
        productID: string, //
    ): Promise<boolean> {
        return (
            await this.productRepository.restore({
                id: productID,
            })
        ).affected
            ? true
            : false;
    }

    /**
     * 모든 상품 삭제 ( 삭제 O )
     */
    async deleteAll(): Promise<boolean> {
        return (await this.productRepository.delete({})).affected
            ? true
            : false;
    }

    /**
     * 모든 상품 삭제 ( 삭제 X )
     * @returns ResultMessage
     */
    async softDeleteAll(): Promise<boolean> {
        return (await this.productRepository.softDelete({})).affected
            ? true
            : false;
    }

    /**
     * 단일 상품 삭제 ( 삭제 O )
     * @param productID
     * @returns ResultMessage
     */
    async delete(
        productID: string, //
    ): Promise<boolean> {
        return (
            await this.productRepository.delete({
                id: productID,
            })
        ).affected
            ? true
            : false;
    }

    /**
     * 단일 상품 삭제 ( 삭제 X )
     * @param productID
     * @returns ResultMessage
     */
    async softDelete(
        productID: string, //
    ): Promise<boolean> {
        return (
            await this.productRepository.softDelete({
                id: productID,
            })
        ).affected
            ? true
            : false;
    }
}
