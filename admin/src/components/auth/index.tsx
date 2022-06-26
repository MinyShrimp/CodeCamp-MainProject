import { Route, Routes } from 'react-router-dom';
import { EmailIndex } from './email';
import { LoginIndex } from './login';
import { TokenIndex } from './token';

export function AuthIndex() {
    return (
        <Routes>
            <Route path="/email" element={<EmailIndex />} />
            <Route path="/token" element={<TokenIndex />} />
            <Route path="/login" element={<LoginIndex />} />
        </Routes>
    );
}
