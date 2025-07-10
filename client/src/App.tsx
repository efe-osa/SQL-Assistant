import styles from './styles/index.module.css';
import sqlLogo from './assets/sql-server.png';
import { useState } from 'react';
import { apiFetch } from './utils/api';

function App() {
  const [queryDescription, setQueryDescription] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const button = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    const buttonName = button.name;

    if (buttonName === 'generate-sql-query') {
      const query = await generateQuery();
      setSqlQuery(query);
    } else if (buttonName === 'ask-database') {
      const query = await askDatabase();
      setSqlQuery(query);
    }
  };

  const generateQuery = async () => {
    const data = await apiFetch('/generate', {
      method: 'POST',
      data: { queryDescription },
    });
    return data.sqlQuery.trim();
  };

  const askDatabase = async () => {
    const data = await apiFetch('/ask-database', {
      method: 'POST',
      data: { queryDescription },
    });
    return data.response.trim();
  };

  const openWindowPrompt = async () => {
    const url = prompt('Enter the URL of the database you want to add');
    const name = prompt('Enter the name of the database you want to add');
    if (url && name) {
      const data = await apiFetch('/add-database', {
        method: 'POST',
        data: { databaseUrl: url, databaseName: name },
      });
      console.log(data);
      alert('Database added successfully');
    }
  };

  return (
    <main className={styles.main}>
      <img src={sqlLogo} className={styles.icon}></img>
      <h3 className={styles.heading}>
        SQL Assistant
      </h3>
        <small>Current Database: cars.db</small>
        <button onClick={openWindowPrompt} className={styles.btnText} type="submit" name="add-database" value="Add Database">
          Add Database using URL
        </button>
      <form className={styles.form} onSubmit={onSubmit}>
        <input
          type="text"
          name="query-description"
          placeholder="What question do you want answered"
          onChange={e => setQueryDescription(e.target.value)}
        />
        <div className={styles.btnGroup}>
          <button
            className={styles.btn}
            type="submit"
            name="generate-sql-query"
            value="Generate SQL Query"
          >
            Generate SQL Query
          </button>
          <button className={styles.btn} type="submit" name="ask-database" value="Ask the database">
            Ask the database
          </button>
        </div>
      </form>
      {sqlQuery && <div className={styles.queryOutput}>{sqlQuery}</div>}
    </main>
  );
}

export default App;
