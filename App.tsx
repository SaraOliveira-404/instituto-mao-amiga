import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ListaPontos from './src/telas/ListaPontos';
import DetalhePonto from './src/telas/DetalhePonto';
import CadastroDoacao from './src/telas/CadastroDoacao';
import MinhasDoacoes from './src/telas/MinhasDoacoes';
import DetalheDoacao from './src/telas/DetalheDoacao';
import type { RootStackParamList } from './src/tipos';

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

          {/* Issue #11: a mesma tela serve para cadastrar e editar. */}
          <Stack.Screen
            name="CadastroDoacao"
            component={CadastroDoacao}
            options={({ route }) => ({
              title: route.params?.doacao ? 'Editar Doação' : 'Cadastrar Doação',
            })}
          />
          {/* Issue #09: tela do histórico de doações */}
          <Stack.Screen
            name="MinhasDoacoes"
            component={MinhasDoacoes}
            options={{ title: 'Minhas Doações' }}
          />

          {/* Issue #10: tela de detalhe (com exclusão e botão de editar) */}
          <Stack.Screen
            name="DetalheDoacao"
            component={DetalheDoacao}
            options={{ title: 'Detalhe da Doação' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}