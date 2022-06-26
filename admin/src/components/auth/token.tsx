import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendGraphQL } from '../logics/sendGraphQL';

/**
 * Restore Token
 * @returns
 */
export function TokenIndex() {
    const navi = useNavigate();
    useEffect(() => {
        (async () => {
            const { data, message } = await sendGraphQL({
                query: `mutation { restoreToken }`,
            });

            if (data) {
                if (data.restoreToken) {
                    localStorage.setItem('access_token', data.restoreToken);
                    navi('/auth/login');
                    return;
                }
            }
            navi('/admin/logic/login');
        })();

        return () => {};
    }, []);

    return <></>;
}
