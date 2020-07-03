import React, { useState } from 'react';

import { FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';

import usePersistedState from '../../utils/usePersistedState';

import logoImg from '../../assets/logo.svg';

import { Container, Title, Form, Repositories, Error } from './styles';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
interface Repository {
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
}
const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = usePersistedState<Repository[]>(
    '@githubExplorer:repositories',
    [],
  );
  async function handleAddRepository(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const setError = (err: string) => {
      toast.error(err);
      setInputError(err);
    };
    if (!newRepo) {
      setError('Digite o autor/nome do repositório.');
      return;
    }

    try {
      const response = await api.get<Repository>(`/repos/${newRepo}`);

      setRepositories([...repositories, response.data]);
      setNewRepo('');
    } catch (err) {
      setError('Erro na busca do repositório');
    }
  }

  return (
    <Container>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore Repositórios no Gihub</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map(repository => (
          <Link
            key={repository.full_name}
            to={`/repository/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </Container>
  );
};

export default Dashboard;
