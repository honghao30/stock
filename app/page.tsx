'use client';

import Button from '@mui/material/Button';
import styled from 'styled-components';
import TextField from '@mui/material/TextField'
import { type } from '../.next/dev/types/routes';

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
`;

const LoginBox = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 50vw;
  border-radius: 12px;
  padding: 20px;
  gap: 20px;
  background: #fff;
`

export default function LoginPage() {
  return (
    <LoginWrapper>
        <LoginBox>
            <TextField id="user-id" label="User Id" fullWidth variant="outlined" />
            <TextField id="user-id" label="Password" fullWidth type="password" variant="outlined" />
            <Button variant="contained" fullWidth size='large'>로그인</Button>
        </LoginBox>
    </LoginWrapper>    
  );
}
