import {View, Text, Button, TextInput} from 'react-native';
import React, {FC} from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'app/redux/store';
import {resetAuth} from 'app/redux/slices/authSlice';

const Questions: FC = () => {
  const [question, setQuestion] = React.useState('');
  const dispatch = useDispatch<AppDispatch>();

  const login = () => {
    dispatch(resetAuth());
  };

  return (
    <View>
      <Text>Questions Screen</Text>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="Ask..."
      />
      <Button title="Post" onPress={() => {}} />
      <Button title="Login" onPress={login} />
    </View>
  );
};

export default Questions;
