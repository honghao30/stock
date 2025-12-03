'use client';

import Button from '@mui/material/Button';
import styled from 'styled-components';
import TextField from '@mui/material/TextField'
import { type } from '../.next/dev/types/routes';
import { useRouter } from 'next/navigation';

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
  max-width: 70vw;
  border-radius: 12px;
  padding: 20px;
  gap: 20px;
  background: #fff;
`
const LoginForm = styled.form `
  width: 100%;
`

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    router.push('/dashboard');
  }

  return (
    <LoginWrapper>
        <LoginBox>
            <LoginForm onSubmit={ handleLogin }>
              <TextField id="user-id" label="User Id" fullWidth variant="outlined" />
              <TextField id="user-id" label="Password" fullWidth type="password" variant="outlined" />
              <Button type="submit" variant="contained" fullWidth size='large'>로그인</Button>
            </LoginForm>
        </LoginBox>
    </LoginWrapper>    
  );
}
