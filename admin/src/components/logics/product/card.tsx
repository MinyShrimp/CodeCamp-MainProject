import { Button, Card } from '@material-ui/core';
import { useState } from 'react';
import { v4 } from 'uuid';
import { numberWithCommas } from '../../../functions/functions';
import { ProductCardStyle, Subtitle } from '../style';

export function ProductCard(props: {
    title: string;
    categorys: Array<string>;
    price: number;
    stock_count: number;
    description: string;
    publisher: {
        name: string;
        description: string;
    };
    author: {
        name: string;
        description: string;
    };
}) {
    const [show, setShow] = useState(false);

    const payment = async (event: any) => {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();

        console.log('결제');
    };

    return (
        <Card
            key={v4()}
            style={{
                width: '100%',
                padding: '1rem',
                cursor: 'pointer',
                marginBottom: '1rem',
            }}
            onClick={() => {
                setShow(!show);
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                }}
            >
                <div>
                    <h3>{props.title}</h3>
                    <Subtitle>{props.categorys.join(' > ')}</Subtitle>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Button
                        color="primary"
                        variant="contained"
                        style={{ height: '20px' }}
                        onClick={payment}
                    >
                        구매
                    </Button>
                    <div>재고량: {numberWithCommas(props.stock_count)}</div>
                    <div>$ {numberWithCommas(props.price)}</div>
                </div>
            </div>

            {show ? (
                <>
                    <hr />
                    <ProductCardStyle>
                        <div style={{ display: 'flex', marginBottom: '1rem' }}>
                            <ProductCardStyle>
                                <div style={{ color: 'gray' }}>출판사</div>
                                <h4>{props.publisher.name}</h4>
                                <div>
                                    {props.publisher.description.slice(0, 100)}
                                </div>
                            </ProductCardStyle>
                            <ProductCardStyle>
                                <div style={{ color: 'gray' }}>저자</div>
                                <h4>{props.author.name}</h4>
                                <div>
                                    {props.author.description.slice(0, 100)}
                                </div>
                            </ProductCardStyle>
                        </div>
                        <div>{props.description}</div>
                    </ProductCardStyle>
                </>
            ) : (
                <></>
            )}
        </Card>
    );
}
