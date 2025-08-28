import React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { preview } from 'radon-ide';

import { Button } from './Button';
import { gap, useScheme } from './Colors';
import { Text } from './Text';
import TrackableButton from './TrackableButton';

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
    ws.current = new WebSocket('ws://localhost:8080');
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
        <SafeAreaView style={style.container}>
          <ScrollView>
            <View style={style.stepContainer}>
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
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
}
function useStyle() {
  const { gap, colors } = useScheme();
  return StyleSheet.create({
    container: { flex: 1, gap: gap, backgroundColor: colors.background },
    stepContainer: { gap, marginHorizontal: gap * 4 },
  });
}

type StepProps = {
  label: string;
  children: string;
  onPress?: () => void;
};
function Step({ label, onPress, children }: StepProps) {
  const [expand, setExpand] = useState(false);

  let content = <Text>{'• ' + label}</Text>;
  if (onPress) {
    content = <Button inline title={'• ' + label} onPress={onPress} />;
  }

  return (
    <View>
      <View style={stepStyle.row}>
        {content}
        <ExpandArrow
          expanded={expand}
          onPress={() => setExpand(expanded => !expanded)}
        />
      </View>
      {expand && <Text style={stepStyle.description}>{children}</Text>}
    </View>
  );
}
const stepStyle = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  description: { marginLeft: gap * 2, fontSize: 12 },
});

function Logo() {
  return (
    <View style={{ marginHorizontal: gap * 3 }}>
      <Image
        source={require('./assets/radon.png')}
        style={{ width: '100%', height: 200, objectFit: 'contain' }}
      />
    </View>
  );
}

type ExpandArrowProps = {
  onPress: () => void;
  expanded: boolean;
};
function ExpandArrow({ expanded, onPress }: ExpandArrowProps) {
  const style = useExpandArrowStyle();
  return (
    <Pressable onPress={onPress} style={style.container}>
      <Text style={style.text}>{expanded ? '↑' : '↓'}</Text>
    </Pressable>
  );
}
function useExpandArrowStyle() {
  const { colors, gap } = useScheme();

  return StyleSheet.create({
    container: { paddingHorizontal: gap, justifyContent: 'center' },
    text: { color: colors.text },
  });
}
