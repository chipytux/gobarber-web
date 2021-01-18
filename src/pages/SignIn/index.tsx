/* eslint-disable no-unused-expressions */
import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiLock, FiMail } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { Container, Content, Background } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { getValidationErrors } from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Digite Email Válido')
            .email('Email obrigatório'),
          password: Yup.string().min(6, 'Senha Obrigadoria'),
        });

        await schema.validate(data, { abortEarly: false });
        await signIn({ email: data.email, password: data.password });
        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(err);
          formRef.current?.setErrors(validationErrors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description:
            'Ocorreu um erro na autenticação, cheque suas credenciais.',
        });
      }
    },
    [addToast, signIn, history],
  );

  return (
    <Container>
      {/* <AnimationContainer> */}
      <Content>
        <img src={logoImg} alt="Gobarber" />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu logon</h1>
          <Input icon={FiMail} name="email" placeholder="email" />
          <Input
            icon={FiLock}
            name="password"
            placeholder="Senha"
            type="password"
          />
          <Button type="submit">Entrar</Button>
          <Link to="/forgot-password">Esqueci minha senha</Link>
        </Form>

        <Link to="/signup">
          <FiLogIn />
          Criar Conta
        </Link>
      </Content>

      <Background />
      {/* </AnimationContainer> */}
    </Container>
  );
};
export default SignIn;
