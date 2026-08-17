import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListaPontos from './ListaPontos';
import DetalhePonto from './DetalhePonto';

export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { pontoId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListaPontos">
        <Stack.Screen
          name="ListaPontos"
          component={ListaPontos}
          options={{ title: 'Pontos de Coleta e Distribuição' }}
        />
        <Stack.Screen
          name="DetalhePonto"
          component={DetalhePonto}
          options={{ title: 'Detalhes do Ponto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}