import React, { useState, useEffect } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ContentLoader, { List } from 'react-content-loader';

import logoImg from '../../assets/logo.svg';

import { Header, RepositoryInfo, Issues } from './styles';
import api from '../../services/api';

interface RepositoryParans {
  repository: string;
}
interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}
interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}
const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParans>();

  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    api.get(`repos/${params.repository}`).then(response => {
      setRepository(response.data);
    });
    api.get(`repos/${params.repository}/issues`).then(response => {
      setIssues(response.data);
    });
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      <RepositoryInfo>
        {repository ? (
          <header>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
        ) : (
          <ContentLoader
            speed={2}
            width={800}
            height={300}
            viewBox="0 0 800 300"
            backgroundColor="#828282"
            foregroundColor="#ecebeb"
          >
            <rect x="165" y="54" rx="3" ry="3" width="300" height="30" />
            <rect x="164" y="102" rx="3" ry="3" width="400" height="20" />
            <circle cx="76" cy="87" r="60" />
          </ContentLoader>
        )}
        {repository && (
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues Abertas</span>
            </li>
          </ul>
        )}
      </RepositoryInfo>

      <Issues>
        {issues &&
          issues.map(issue => (
            <a key={issue.id} href={issue.html_url} target="_blank">
              <div>
                <strong>{issue.title}</strong>
                <p>{issue.user.login}</p>
              </div>
              <FiChevronRight size={20} />
            </a>
          ))}
        {issues && (
          <>
            <a>
              <List />
            </a>
            <a>
              <List />
            </a>
            <a>
              <List />
            </a>
            <a>
              <List />
            </a>
          </>
        )}
      </Issues>
    </>
  );
};

export default Repository;
