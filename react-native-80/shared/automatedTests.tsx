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

export function AutomatedTests({ ws }: { ws: WebSocket | null }) {
  const style = useStyle();

  return (
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
  );
}

function useStyle() {
  const { gap, colors } = useScheme();
  return StyleSheet.create({
    container: { gap: gap, backgroundColor: colors.background },
    stepContainer: { gap, marginHorizontal: gap * 4 },
  });
}
