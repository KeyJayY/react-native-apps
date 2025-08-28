import { useRef, useEffect } from 'react';
import {
  View,
  Button,
  Dimensions,
  Pressable,
  Text,
  StyleSheet,
} from 'react-native';

const { width: phoneWidth, height: phoneHeight } = Dimensions.get('window');

type TrackableButtonProps = {
  id: string;
  title: string;
  onPress?: (id: string) => void;
  ws: any;
};

const TrackableButton = ({ id, title, onPress, ws }: TrackableButtonProps) => {
  const ref = useRef<View>(null);

  const measure = (cb: (data: any) => void) => {
    ref.current?.measureInWindow((x, y, width, height) => {
      cb({
        id,
        x: x / phoneWidth - 0.5,
        y: y / phoneHeight - 0.5,
        width: width / phoneWidth,
        height: height / phoneHeight,
      });
    });
  };

  useEffect(() => {
    if (!ws.current) return;
    ws.current.addEventListener('message', (e: any) => {
      if (e.data === `getPosition:${id}`) {
        measure(pos => {
          ws.current.send(JSON.stringify(pos));
        });
      }
    });
  }, [ws]);

  return (
    <Pressable
      style={styles.button}
      ref={ref}
      onPress={() => {
        ws.current?.send(`{"action":"${id}"}`);
        onPress?.(id);
      }}
    >
      <Text>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#5bf',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TrackableButton;
