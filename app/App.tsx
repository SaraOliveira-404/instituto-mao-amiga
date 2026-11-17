import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ListaPontos from './src/telas/ListaPontos';
import DetalhePonto from './src/telas/DetalhePonto';
import CadastroPonto from './src/telas/CadastroPonto';
import CadastroDoacao from './src/telas/CadastroDoacao';
import MinhasDoacoes from './src/telas/MinhasDoacoes';
import DetalheDoacao from './src/telas/DetalheDoacao';
import MeusPontos from './src/telas/MeusPontos';
import type { RootStackParamList } from './src/tipos/navegacao';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Pilha de navegação: cada tela do app é registrada aqui.
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
            name="CadastroPonto"
            component={CadastroPonto}
            options={({ route }) => ({
              title: route.params?.ponto ? 'Editar Ponto' : 'Cadastrar Ponto',
            })}
          />

          <Stack.Screen
            name="CadastroDoacao"
            component={CadastroDoacao}
            options={({ route }) => ({
              title: route.params?.doacao ? 'Editar Doação' : 'Cadastrar Doação',
            })}
          />

          <Stack.Screen
            name="MinhasDoacoes"
            component={MinhasDoacoes}
            options={{ title: 'Minhas Doações' }}
          />

          <Stack.Screen
            name="DetalheDoacao"
            component={DetalheDoacao}
            options={{ title: 'Detalhe da Doação' }}
          />

          <Stack.Screen
            name="MeusPontos"
            component={MeusPontos}
            options={{ title: 'Meus Pontos' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}