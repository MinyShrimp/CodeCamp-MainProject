import { useEffect } from 'react';
import { v4 } from 'uuid';
import { LogicHeader } from '../header';
import { sendGraphQL } from '../sendGraphQL';
import { ProductCard } from './card';

export function ProductIndex() {
    const desc = `Contrary to popular belief, Lorem Ipsum is not simply
    random text. It has roots in a piece of classical Latin
    literature from 45 BC, making it over 2000 years old.
    Richard McClintock, a Latin professor at Hampden-Sydney
    College in Virginia, looked up one of the more obscure
    Latin words, consectetur, from a Lorem Ipsum passage,
    and going through the cites of the word in classical
    literature, discovered the undoubtable source. Lorem
    Ipsum comes from sections 1.10.32 and 1.10.33 of "de
    Finibus Bonorum et Malorum" (The Extremes of Good and
    Evil) by Cicero, written in 45 BC. This book is a
    treatise on the theory of ethics, very popular during
    the Renaissance. The first line of Lorem Ipsum, "Lorem
    ipsum dolor sit amet..", comes from a line in section
    1.10.32. The standard chunk of Lorem Ipsum used since
    the 1500s is reproduced below for those interested.
    Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et
    Malorum" by Cicero are also reproduced in their exact
    original form, accompanied by English versions from the
    1914 translation by H. Rackham.`;

    useEffect(() => {
        sendGraphQL({
            query: 'query {}',
        });
        return () => {};
    }, []);

    return (
        <>
            <LogicHeader entityName="Product" />
            <div
                style={{
                    background: '#9beffe',
                    height: 'calc(100vh - 210px)',
                    padding: '1rem',
                    overflowX: 'hidden',
                    overflowY: 'scroll',
                }}
            >
                {Array.from({ length: 10 }, (_) => {
                    return (
                        <ProductCard
                            key={v4()}
                            title="Title"
                            categorys={['c1', 'c2', 'c3', 'c4']}
                            price={10000}
                            stock_count={100}
                            description={desc}
                            publisher={{
                                name: 'Lorem Ipsum',
                                description: desc,
                            }}
                            author={{
                                name: 'Lorem Ipsum',
                                description: desc,
                            }}
                        />
                    );
                })}
            </div>
        </>
    );
}
