import { Button, Card } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { numberWithCommas } from '../../../functions/functions';
import { IUserInfo } from '../logout/interface';
import { sendGraphQLWithAuth } from '../sendGraphQL';
import { ProductCardStyle, Subtitle } from '../style';
import { IPaymentInput, IProduct } from './interface';

export function ProductCard(props: {
    product: IProduct; //
}) {
    const [show, setShow] = useState(false);
    const [user, setUser] = useState<IUserInfo>({
        id: '',
        name: '',
        email: '',
        phone: null,
    });

    async function getLoginUser() {
        const { data, status } = await sendGraphQLWithAuth({
            query: `query { fetchLoginUser { id, email, name, phone } }`,
        });

        if (status) {
            if (data.fetchLoginUser) {
                setUser(data.fetchLoginUser);
            }
        }
        return status;
    }

    async function postPayment(
        rsp: IPaymentInput, //
    ): Promise<boolean> {
        console.log(rsp);
        const { data, status } = await sendGraphQLWithAuth({
            query: `mutation { 
                createPayment ( 
                    createPaymentInput: { 
                        impUid: "${rsp.imp_uid}",
                        merchantUid: "${rsp.merchant_uid}",
                        amount: ${rsp.paid_amount},
                        status: ${rsp.status},
                        productID: "${props.product.id}"
                    } 
                ) { id } 
            }`,
        });
        return status;
    }

    useEffect(() => {
        getLoginUser();
    }, []);

    const payment = async (event: any) => {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();

        const productID = props.product.id;
        const accessToken = localStorage.getItem('access_token');

        if (productID === null || accessToken === null) {
            alert('로그인 후 사용 바랍니다.');
            return;
        }

        console.log(user);

        // @ts-ignore
        const IMP = window.IMP;
        IMP.init(process.env.IMP_UID);
        IMP.request_pay(
            {
                pg: 'html5_inicis',
                pay_method: 'card',
                name: props.product.name,
                amount: props.product.price,
                buyer_email: user.email,
                buyer_name: user.name,
                buyer_tel: user.phone || '010-2011-5029',
            },
            async (rsp: any) => {
                if (rsp.success) {
                    await postPayment({
                        imp_uid: rsp.imp_uid,
                        merchant_uid: rsp.merchant_uid,
                        paid_amount: rsp.paid_amount,
                        status: rsp.status.toUpperCase(),
                    });
                } else {
                    alert(rsp.error_msg);
                }
            },
        );
    };

    return (
        <Card
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
                    <h3>{props.product.name}</h3>
                    <Subtitle>{props.product.categorys.join(' > ')}</Subtitle>
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
                    <div>
                        재고량: {numberWithCommas(props.product.stock_count)}
                    </div>
                    <div>$ {numberWithCommas(props.product.price)}</div>
                </div>
            </div>

            {show ? (
                <>
                    <hr />
                    <ProductCardStyle>
                        <div style={{ display: 'flex', marginBottom: '1rem' }}>
                            <ProductCardStyle style={{ width: '100%' }}>
                                <div style={{ color: 'gray' }}>출판사</div>
                                <h4>{props.product.publisher.name}</h4>
                                <div>
                                    {props.product.publisher.description.slice(
                                        0,
                                        100,
                                    )}
                                </div>
                            </ProductCardStyle>
                            <ProductCardStyle style={{ width: '100%' }}>
                                <div style={{ color: 'gray' }}>저자</div>
                                <h4>{props.product.author.name}</h4>
                                <div>
                                    {props.product.author.description.slice(
                                        0,
                                        100,
                                    )}
                                </div>
                            </ProductCardStyle>
                        </div>
                        <div>{props.product.description}</div>
                    </ProductCardStyle>
                </>
            ) : (
                <></>
            )}
        </Card>
    );
}
