import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ListaPontos from './src/telas/ListaPontos';
import DetalhePonto from './src/telas/DetalhePonto';
import CadastroDoacao from './src/telas/CadastroDoacao';
import MinhasDoacoes from './src/telas/MinhasDoacoes';
import type { RootStackParamList } from './src/tipos';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
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
          <Stack.Screen
            name="CadastroDoacao"
            component={CadastroDoacao}
            options={{ title: 'Cadastrar Doação' }}
          />
          <Stack.Screen
            name="MinhasDoacoes"
            component={MinhasDoacoes}
            options={{ title: 'Minhas Doações' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}