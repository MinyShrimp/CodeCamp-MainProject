import { Button, Input, Typography } from '@material-ui/core';
import { BatteryAlert } from '@material-ui/icons';
import { useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LogicHeader } from '../header';
import { sendGraphQL } from '../sendGraphQL';
import {
    CardBody,
    CardFooter,
    CardStyle,
    Container,
    InputGroup,
    Label,
} from '../style';

export function LogicRegisterIndex() {
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMsg, setAlertMsg] = useState<string>('');
    const navi = useNavigate();

    const input = useRef<{ email: string; pwd: string; name: string }>({
        email: '',
        pwd: '',
        name: '',
    });

    const submit = async () => {
        try {
            const { data, message } = await sendGraphQL({
                query: `mutation { createUser( createUserInput: { name: "${input.current.name}", email: "${input.current.email}", pwd: "${input.current.pwd}" } ) { id } }`,
            });

            if (data) {
                navi('/admin/entity/user');
            } else {
                setShowAlert(true);
                setAlertMsg(message as string);
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <LogicHeader entityName="Register" />
            <Container>
                <CardStyle>
                    <Typography
                        variant="h3"
                        className="mb-3"
                        style={{ textAlign: 'center' }}
                    >
                        {' '}
                        Register{' '}
                    </Typography>
                    <CardBody>
                        {showAlert ? (
                            <Alert
                                variant="warning"
                                style={{
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <BatteryAlert />
                                {alertMsg}
                            </Alert>
                        ) : (
                            <></>
                        )}

                        <InputGroup>
                            <Label htmlFor="name">
                                <Typography>Name</Typography>
                            </Label>
                            <Input
                                style={{ width: '100%' }}
                                id="name"
                                name="name"
                                onChange={(e) => {
                                    input.current.name = e.target.value;
                                }}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="email">
                                <Typography>Email</Typography>
                            </Label>
                            <Input
                                style={{ width: '100%' }}
                                id="email"
                                name="email"
                                type="email"
                                onChange={(e) => {
                                    input.current.email = e.target.value;
                                }}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="pwd">
                                <Typography>Password</Typography>
                            </Label>
                            <Input
                                style={{ width: '100%' }}
                                id="pwd"
                                name="pwd"
                                type="password"
                                onChange={(e) => {
                                    input.current.pwd = e.target.value;
                                }}
                            />
                        </InputGroup>
                        <CardFooter>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={submit}
                            >
                                Submit
                            </Button>
                        </CardFooter>
                    </CardBody>
                </CardStyle>
            </Container>
        </>
    );
}

// import { LogicFactory } from '../logic_factory';

// export const LogicRegisterIndex = LogicFactory.createIndex<any>({
//     name: 'Register',
// });
