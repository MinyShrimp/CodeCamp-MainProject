import { Card } from '@material-ui/core';
import styled from 'styled-components';

export const Container = styled.div`
    background: #9beffe;
    height: calc(100vh - 210px);
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const InputGroup = styled.div`
    margin-bottom: 2rem;
`;

export const Label = styled.label`
    display: block;
    margin-bottom: 1rem;
`;

export const CardStyle = styled(Card)`
    width: 600px;
    height: auto;
    padding: 3rem;
`;

export const CardBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 80%;
`;

export const CardFooter = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const Subtitle = styled.p`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 0.2em;
`;