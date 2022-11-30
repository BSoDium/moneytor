import React, { useEffect, useState } from 'react';
import { Input, Spacer, Text } from '@nextui-org/react';
import { BsCheck2 } from 'react-icons/bs';
import WakatimeClient from './utils/WakatimeClient';

import './scss/App.global.scss';

export default function App() {
  const [token, setToken] = useState('');
  const [client, setClient] = useState<WakatimeClient>();

  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      // TODO: Fetch data from Wakatime (https://wakatime.com/developers#authentication)

      setTime(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, [])


  return client ? (
    <div className="container">
      <Text h1>Wakatime Stats</Text>
      <Text h2>Time: {new Date(time).toLocaleTimeString()}</Text>
    </div>
  ) : (
    <div className="container">
      <Text h1 size={60} css={{
        textGradient: "45deg, $blue600 -20%, $pink600 50%",
      }}
        weight="bold"
      >Moneytor.</Text>
      <Text h2>Your time is worth money.</Text>
      <Spacer y={1} />
      <Input
        clearable
        type='password'
        labelPlaceholder='Wakatime API Key'
        width='min(90%, 400px)'
        contentRight={client ? <BsCheck2 /> : null}
        status={client ? 'success' : (token ? 'error' : 'default')}
        onChange={async (e) => {
          setToken(e.target.value);
          const newClient = new WakatimeClient(token);
          if (await newClient.isApiKeyValid()) {
            setClient(newClient);
          }
        }}
      />
    </div>
  );
}
