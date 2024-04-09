import {View, Text, Button, TextInput} from 'react-native';
import React, {FC} from 'react';

const Questions: FC = () => {
  const [question, setQuestion] = React.useState('');
  return (
    <View>
      <Text>Questions Screen</Text>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="Ask..."
      />
      <Button title="Post" onPress={() => {}} />
    </View>
  );
};

export default Questions;
