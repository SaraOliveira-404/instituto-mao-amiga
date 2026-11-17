import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../tipos/navegacao';
import type { PontoDados } from '../tipos/ponto';
import { cadastrar, editar } from '../services/pontosService';
import { ApiError } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroPonto'>;

const tiposPonto = ['coleta', 'distribuição'];

// Campos de texto do formulário (o tipo é tratado à parte, com os dois botões)
const campos: {
    chave: 'nome' | 'endereco' | 'bairro' | 'horario';
    rotulo: string;
    placeholder: string;
}[] = [
        { chave: 'nome', rotulo: 'Nome', placeholder: 'Nome do ponto' },
        { chave: 'endereco', rotulo: 'Endereço', placeholder: 'Ex.: Rua 15, nº 320' },
        { chave: 'bairro', rotulo: 'Bairro', placeholder: 'Ex.: Setor Central' },
        { chave: 'horario', rotulo: 'Horário', placeholder: 'Ex.: Seg a Sex, 8h às 17h' },
    ];

type Erros = Partial<Record<keyof PontoDados, string>>;

export default function CadastroPonto({ route, navigation }: Props) {
    // Se a tela recebeu um ponto pela navegação, está em modo edição
    const pontoEditando = route.params?.ponto;
    const modoEdicao = pontoEditando !== undefined;

    // Valores digitados. Na edição já começam preenchidos com os dados do ponto.
    const [valores, setValores] = useState<PontoDados>({
        nome: pontoEditando?.nome ?? '',
        endereco: pontoEditando?.endereco ?? '',
        bairro: pontoEditando?.bairro ?? '',
        horario: pontoEditando?.horario ?? '',
        tipo: pontoEditando?.tipo ?? '',
    });
    const [erros, setErros] = useState<Erros>({}); 
    const [erroEnvio, setErroEnvio] = useState(''); 
    const [enviando, setEnviando] = useState(false);

    // Atualiza um campo e limpa os erros dele 
    function alterar(chave: keyof PontoDados, valor: string) {
        setValores((v) => ({ ...v, [chave]: valor }));
        setErros((e) => ({ ...e, [chave]: undefined }));
        setErroEnvio('');
    }

    // Validação antes de enviar: nenhum campo pode ficar vazio
    function validar(): boolean {
        const novos: Erros = {};
        if (valores.nome.trim() === '') novos.nome = 'Informe o nome.';
        if (valores.endereco.trim() === '') novos.endereco = 'Informe o endereço.';
        if (valores.bairro.trim() === '') novos.bairro = 'Informe o bairro.';
        if (valores.horario.trim() === '') novos.horario = 'Informe o horário.';
        if (valores.tipo === '') novos.tipo = 'Escolha o tipo do ponto.';
        setErros(novos);
        return Object.keys(novos).length === 0;
    }

    async function salvar() {
        setErroEnvio('');
        if (!validar()) return; 

        const dados: PontoDados = {
            nome: valores.nome.trim(),
            endereco: valores.endereco.trim(),
            bairro: valores.bairro.trim(),
            horario: valores.horario.trim(),
            tipo: valores.tipo,
        };

        setEnviando(true);
        try {
            // Edição envia PUT; cadastro novo envia POST
            if (pontoEditando) await editar(pontoEditando.id, dados);
            else await cadastrar(dados);

            // Só chega aqui se a API aceitou. A tela anterior recarrega sozinha ao ficar visível.
            navigation.goBack();
        } catch (e) {
            // Em qualquer falha a tela continua aberta, com tudo o que foi digitado
            if (e instanceof ApiError && e.status === 400) {
                setErroEnvio('A API recusou os dados enviados. Confira os campos e tente novamente.');
            } else if (e instanceof ApiError && e.status === 404) {
                setErroEnvio('Este ponto não existe mais na API.');
            } else {
                setErroEnvio('Não foi possível falar com a API. Verifique se ela está ligada e tente novamente.');
            }
            setEnviando(false);
        }
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    {campos.map((c) => (
                        <View key={c.chave} style={styles.campo}>
                            <Text style={styles.label}>{c.rotulo}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={c.placeholder}
                                value={valores[c.chave]}
                                onChangeText={(texto) => alterar(c.chave, texto)}
                            />
                            {erros[c.chave] ? <Text style={styles.erro}>{erros[c.chave]}</Text> : null}
                        </View>
                    ))}

                    {/* Tipo: dois botões, o escolhido fica destacado */}
                    <View style={styles.campo}>
                        <Text style={styles.label}>Tipo</Text>
                        <View style={styles.linhaTipos}>
                            {tiposPonto.map((tipo) => {
                                const escolhido = valores.tipo === tipo;
                                return (
                                    <TouchableOpacity
                                        key={tipo}
                                        style={[styles.botaoTipo, escolhido && styles.botaoTipoEscolhido]}
                                        onPress={() => alterar('tipo', tipo)}
                                    >
                                        <Text style={[styles.textoTipo, escolhido && styles.textoTipoEscolhido]}>
                                            {tipo}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {erros.tipo ? <Text style={styles.erro}>{erros.tipo}</Text> : null}
                    </View>

                    {/* Mensagem de erro da API (400 ou API desligada) */}
                    {erroEnvio !== '' && <Text style={styles.erroEnvio}>{erroEnvio}</Text>}

                    <TouchableOpacity
                        style={[styles.botao, enviando && styles.botaoDesabilitado]}
                        onPress={salvar}
                        disabled={enviando}
                    >
                        <Text style={styles.textoBotao}>
                            {enviando ? 'Enviando...' : modoEdicao ? 'Salvar alterações' : 'Cadastrar Ponto'}
                        </Text>
                    </TouchableOpacity>

                    {modoEdicao && (
                        <TouchableOpacity style={styles.botaoCancelar} onPress={() => navigation.goBack()}>
                            <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    flex: { flex: 1 },
    scrollContent: { padding: 24, flexGrow: 1 },
    campo: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    linhaTipos: { flexDirection: 'row', gap: 12 },
    botaoTipo: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#1B3A5C',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
    },
    botaoTipoEscolhido: { backgroundColor: '#1B3A5C' },
    textoTipo: { fontSize: 15, fontWeight: '600', color: '#1B3A5C' },
    textoTipoEscolhido: { color: '#fff' },
    erro: { color: '#d32f2f', fontSize: 13, marginTop: 4 },
    erroEnvio: { color: '#d32f2f', fontSize: 15, fontWeight: '600', textAlign: 'center', marginBottom: 8 },
    botao: {
        backgroundColor: '#2e7d32',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        minHeight: 44,
    },
    botaoDesabilitado: { opacity: 0.6 },
    textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    botaoCancelar: {
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        minHeight: 44,
    },
    textoBotaoCancelar: { color: '#333333', fontWeight: 'bold', fontSize: 16 },
});