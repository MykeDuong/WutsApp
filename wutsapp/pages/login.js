import styled from 'styled-components'
import Head from 'next/head'
import { Button } from '@mui/material'
import { auth, provider } from '../firebase';

const Login = () => {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  }

  return (
    <Container>
      <Head>

      </Head>
      <LoginContainer>
        <Logo src="/assets/whatsapp.png" alt="whatsapp" />
        <Button onClick={signIn} variant="outlined">Sign in with Google</Button>
      </LoginContainer>
    </Container>

  )
}

export default Login

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;

  background-color: whitesmoke;

`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding: 100px;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;