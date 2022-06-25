import { sendGraphQL } from '../sendGraphQL';
import { LogicHeader } from '../header';
import { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { CardStyle, Container } from '../style';
import { AttachMoney, Email, Forward, PhoneIphone } from '@material-ui/icons';
import { Subtitle } from '../style';

interface IUserInfo {
    id: string;
    email: string;
    name: string;
    phone: string;
    point: number;
}

export function LogicLogoutIndex() {
    const navi = useNavigate();
    const [info, setInfo] = useState<IUserInfo>({
        id: '',
        email: '',
        name: '',
        point: 0,
        phone: '',
    });

    const submit = async () => {
        const token = localStorage.getItem('access_token');
        if (token === null) {
            return;
        }

        const { data, message } = await sendGraphQL({
            query: `mutation { Logout { id, msg } }`,
            header: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (data) {
            localStorage.removeItem('access_token');
            navi('/admin/entity/user');
        } else {
        }
    };

    const getLoginUser = async () => {
        const token = localStorage.getItem('access_token');
        if (token === null) {
            return;
        }

        const { data, message } = await sendGraphQL({
            query: `query { fetchLoginUser { id, name, email, point, phone } }`,
            header: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (data) {
            setInfo(data.fetchLoginUser);
        } else {
        }
    };

    useEffect(() => {
        getLoginUser();
    }, []);

    return (
        <>
            <LogicHeader entityName="Logout" />
            <Container style={{ fontFamily: 'SCDream !important' }}>
                <CardStyle
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <h3>{info.name}</h3>
                        <Subtitle>
                            <Forward
                                style={{ marginRight: '0.5rem' }}
                                fontSize="small"
                            />{' '}
                            {info.id}
                        </Subtitle>
                        <Subtitle>
                            <Email
                                style={{ marginRight: '0.5rem' }}
                                fontSize="small"
                            />{' '}
                            {info.email}
                        </Subtitle>
                        <Subtitle>
                            <PhoneIphone
                                style={{ marginRight: '0.5rem' }}
                                fontSize="small"
                            />{' '}
                            {info.phone}
                        </Subtitle>
                        <Subtitle>
                            <AttachMoney
                                style={{ marginRight: '0.5rem' }}
                                fontSize="small"
                            />{' '}
                            {info.point}
                        </Subtitle>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            height: '120px',
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={submit}
                        >
                            Logout
                        </Button>
                    </div>
                </CardStyle>
            </Container>
        </>
    );
}

// import { LogicFactory } from '../logic_factory';

// export const LogicLogoutIndex = LogicFactory.createIndex({
//     name: 'Logout',
// });
