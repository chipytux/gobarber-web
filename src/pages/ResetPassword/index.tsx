/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
import React, { useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { getValidationErrors } from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import { api } from '../../services/api';

interface ResetPasswordFordData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFordData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().min(6, 'Senha Obrigadoria'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Senhas devem ser iguais',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        const token = location.search.replace('?token=', '');
        const { password, password_confirmation } = data;
        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(err);
          formRef.current?.setErrors(validationErrors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na trocar senha',
          description: 'Ocorreu um erro na troca de senha, tente novamente',
        });
      }
    },
    [addToast, history, location],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Gobarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu logon</h1>
            <Input
              icon={FiLock}
              name="password"
              placeholder="Nova Senha"
              type="password"
            />
            <Input
              icon={FiLock}
              name="password_confirmation"
              placeholder="Confirmação de Senha"
              type="password"
            />
            <Button type="submit">Aterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};
export default ResetPassword;
