// Confirmação e aviso que funcionam no navegador (window.confirm/alert) e no celular (Alert.alert).
import { Alert, Platform } from 'react-native';

// Devolve true se a pessoa confirmou e false se cancelou
export function confirmar(
  titulo: string,
  mensagem: string,
  textoConfirmar = 'Excluir'
): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }
  return new Promise((resolve) => {
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: textoConfirmar, style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
}

export function avisar(titulo: string, mensagem: string): void {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}