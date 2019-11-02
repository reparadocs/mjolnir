import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import ApiClient from './APIClient';
import useSWR from '@zeit/swr';
import { useCookies } from 'react-cookie';
import Question from './Question';
import moment from 'moment';
import Result from './Result';

const uuidv4 = require('uuid/v4');


function App() {
  const [cookies, setCookie] = useCookies(['uid']);
  const [uid, setUid] = useState(null);
  const [screen, setScreen] = useState('question');
  const { data, error } = useSWR('/v1/status', () => ApiClient.get('status'));

  useEffect(() => {
    if (!uid) {
      if ('uid' in cookies) {
        setUid(cookies['uid']);
      } else {
        let uuid = uuidv4();
        setCookie('uid', uuid)
        setUid(uuid);
      }
    }
  });

  let onOptionChosen = () => setScreen('result');

  if (!data) return <p>Loading...</p>;
  console.log(data);
  console.log(error);
  let timeDiff = moment().diff(moment(data.time));

  return (
    <div className="App">
      <header className="App-header">
        {screen === 'question' ?
          <Question data={data} onClick={onOptionChosen} />
          : <Result data={data} />
        }
      </header>
    </div>
  );
}

export default App;
