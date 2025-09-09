import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { preview } from 'radon-ide';

import { Button } from './Button';
import { useScheme } from './Colors';
import TrackableButton from './TrackableButton';
import { Platform } from 'react-native';

preview(
  <Button
    title="Button"
    onPress={() => {
      console.log('console.log()');
    }}
  />,
);

function printLogs() {
  // put breakpoint on the next line
  const text = 'console.log()';
  console.log(text);
}

export function MainScreen() {
  const style = useStyle();
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const host = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';
    ws.current = new WebSocket(`ws://${host}:8080`);
    ws.current.onopen = () => {
      console.log('Connected to server');
      setConnected(true);
    };
    ws.current.addEventListener('message', e => {
      console.log('server message', e.data);
    });
  }, []);

  return (
    <>
      {connected && (
        <View
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={style.container}>
            <TrackableButton
              ws={ws}
              id="console-log-button"
              title="Test console logs and breakpoints"
              onPress={printLogs}
            />
            <TrackableButton
              ws={ws}
              id="uncaught-exception-button"
              title="Check uncaught exceptions"
              onPress={() => {
                const tryToThrow = 'expected error';
                throw new Error(tryToThrow);
              }}
            />
            <TrackableButton
              ws={ws}
              id="fetch-request-button"
              title="Fetch request visible in network panel"
              onPress={async () => {
                const response = await fetch(
                  'https://pokeapi.co/api/v2/pokemon/ditto',
                );
                console.log('Response', response);
              }}
            />
          </View>
        </View>
      )}
    </>
  );
}

function useStyle() {
  const { gap, colors } = useScheme();
  return StyleSheet.create({
    container: { gap: gap, backgroundColor: colors.background },
    stepContainer: { gap, marginHorizontal: gap * 4 },
  });
}
