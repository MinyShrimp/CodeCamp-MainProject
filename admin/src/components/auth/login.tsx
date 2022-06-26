import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendGraphQL } from '../logics/sendGraphQL';

export function LoginIndex() {
    const navi = useNavigate();

    useEffect(() => {
        (async () => {
            const { data, message } = await sendGraphQL({
                query: `mutation { LoginOAuth }`,
                header: {
                    Authorization: `Bearer ${localStorage.getItem(
                        'access_token',
                    )}`,
                },
            });

            if (data) {
                navi('/admin/entity/user');
                return;
            }
            navi('/admin/logic/login');
        })();

        return () => {};
    }, []);

    return <></>;
}
