import { useCallback, useEffect, useState } from 'react';
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
import type { DoacaoDados } from '../tipos/doacao';
import type { Ponto } from '../tipos/ponto';
import { listar as listarTodosPontos } from '../services/pontosService';
import { cadastrar, editar } from '../services/doacoesService'; 
import { ApiError } from '../services/api'; 
import { tiposItem } from '../dados/TiposItem';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroDoacao'>;

// FORMULÁRIO ÚNICO: serve para CADASTRAR uma doação nova e para EDITAR uma existente.
export default function CadastroDoacao({ route, navigation }: Props) {
    // Se a tela recebeu uma doação pela navegação, está em modo edição.
    const doacaoEditando = route.params?.doacao;
    const modoEdicao = doacaoEditando !== undefined;

    // Campos do formulário. Na edição já começam preenchidos com os dados da doação.
    const [tipoItem, setTipoItem] = useState(doacaoEditando?.tipoItem ?? '');
    const [quantidade, setQuantidade] = useState(doacaoEditando ? String(doacaoEditando.quantidade) : '');
    const [descricao, setDescricao] = useState(doacaoEditando?.descricao ?? '');
    const [pontoSelecionado, setPontoSelecionado] = useState<Ponto | null>(null);

    // Mensagens de erro de cada campo (vazias quando está tudo certo)
    const [erroTipoItem, setErroTipoItem] = useState('');
    const [erroQuantidade, setErroQuantidade] = useState('');
    const [erroPontoDestino, setErroPontoDestino] = useState('');
    const [erroDescricao, setErroDescricao] = useState('');

    // Pontos vindos da API e mensagem de erro caso ela esteja fora do ar
    const [pontos, setPontos] = useState<Ponto[]>([]);
    const [erroPontos, setErroPontos] = useState('');
    const [carregandoPontos, setCarregandoPontos] = useState(true); //NOVO
    const [mostrarTipos, setMostrarTipos] = useState(false);
    const [mensagemSucesso, setMensagemSucesso] = useState('');

    //NOVO: erro vindo da API ao salvar (400 ou API desligada)
    const [erroEnvio, setErroEnvio] = useState('');
    const [enviando, setEnviando] = useState(false);

    // Os outros campos só liberam depois que o tipo do item é escolhido
    const tipoSelecionado = tipoItem.trim() !== '';

    // Faz a mensagem de sucesso sumir sozinha depois de 1 segundo
    useEffect(() => {
        if (mensagemSucesso === '') return;

        const timer = setTimeout(() => setMensagemSucesso(''), 1000);
        return () => clearTimeout(timer);
    }, [mensagemSucesso]);

    const carregarPontos = useCallback(async () => {
        setErroPontos('');
        setCarregandoPontos(true);
        try {
            setPontos(await listarTodosPontos());
        } catch {
            setErroPontos('Não foi possível carregar os pontos. Verifique se a API está ligada.');
        } finally {
            setCarregandoPontos(false);
        }
    }, []);

    useEffect(() => {
        carregarPontos();
    }, [carregarPontos]);

    // Na edição: quando os pontos chegam, destaca o ponto que já era o destino da doação
    useEffect(() => {
        if (!doacaoEditando || pontoSelecionado !== null) return;
        const achado = pontos.find((p) => p.nome === doacaoEditando.pontoDestino);
        if (achado) setPontoSelecionado(achado);
    }, [pontos]);

    // ---------- VALIDAÇÕES (cada uma devolve true se o campo está ok) ----------

    function validarTipoItem(valor: string): boolean {
        setTipoItem(valor);

        if (valor.trim() === '') {
            setErroTipoItem('Selecione o tipo do item.');
            return false;
        }

        setErroTipoItem('');
        return true;
    }

    function selecionarTipo(tipo: string) {
        validarTipoItem(tipo);
        setMostrarTipos(false);
    }

    // Quantidade: não pode ser vazia, deve ser inteiro e maior que zero
    function validarQuantidade(valor: string): boolean {
        setQuantidade(valor);

        if (valor.trim() === '') {
            setErroQuantidade('Informe a quantidade.');
            return false;
        }

        if (!/^\d+$/.test(valor)) {
            setErroQuantidade('Quantidade deve ser um número inteiro.');
            return false;
        }

        if (Number(valor) <= 0) {
            setErroQuantidade('Quantidade deve ser maior que zero.');
            return false;
        }

        setErroQuantidade('');
        return true;
    }

    function validarDescricao(valor: string): boolean {
        setDescricao(valor);

        if (valor.trim() === '') {
            setErroDescricao('Informe uma descrição para o item.');
            return false;
        }

        setErroDescricao('');
        return true;
    }

    // Ponto de destino: precisa ter sido escolhido na lista
    function validarPontoDestino(): boolean {
        if (pontoSelecionado === null) {
            setErroPontoDestino('Selecione um ponto de destino.');
            return false;
        }

        setErroPontoDestino('');
        return true;
    }

    function selecionarPonto(ponto: Ponto) {
        setPontoSelecionado(ponto);
        setErroPontoDestino('');
    }

    //lista dos pontos da API em ordem alfabética
    const pontosOrdenados = [...pontos].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

    // ---------- SALVAR ----------
    // Cadastra uma doação nova (POST) OU salva as alterações de uma existente (PUT)
    async function handleCadastrar() {
        setMensagemSucesso('');
        setErroEnvio('');

        // Roda todas as validações para mostrar todos os erros de uma vez
        const okTipo = validarTipoItem(tipoItem);
        const okQuantidade = validarQuantidade(quantidade);
        const okDescricao = validarDescricao(descricao);
        const okPonto = validarPontoDestino();

        // Se algum campo estiver inválido, não envia nada
        if (!okTipo || !okQuantidade || !okDescricao || !okPonto) return;

        // Vai para a API o NOME do ponto escolhido
        const dados: DoacaoDados = {
            tipoItem: tipoItem.trim(),
            quantidade: Number(quantidade.trim()),
            pontoDestino: pontoSelecionado!.nome,
            descricao: descricao.trim(),
        };

        setEnviando(true);
        try {

            if (doacaoEditando) {
                const atualizada = await editar(doacaoEditando.id, dados);
                navigation.popTo('DetalheDoacao', {
                    doacao: atualizada,
                    mensagem: 'Doação editada com sucesso!',
                });
                return;
            }

            await cadastrar(dados);
            setMensagemSucesso('Doação cadastrada com sucesso!');

            // Só chega aqui se a API aceitou: limpa o formulário para um novo cadastro
            setTipoItem('');
            setQuantidade('');
            setDescricao('');
            setPontoSelecionado(null);
            setMostrarTipos(false);
            setErroTipoItem('');
            setErroQuantidade('');
            setErroPontoDestino('');
            setErroDescricao('');
        } catch (e) {
            //Em qualquer falha a tela continua aberta, com tudo o que foi digitado
            if (e instanceof ApiError && e.status === 400) {
                setErroEnvio('A API recusou os dados enviados. Confira os campos e tente novamente.');
            } else if (e instanceof ApiError && e.status === 404) {
                setErroEnvio('Esta doação não existe mais na API.');
            } else {
                setErroEnvio('Não foi possível falar com a API. Verifique se ela está ligada e tente novamente.');
            }
        } finally {
            setEnviando(false);
        }
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Campo tipo do item (seletor com lista) */}
                    <View style={styles.campo}>
                        <Text style={styles.label}>Tipo do item</Text>

                        <TouchableOpacity
                            style={styles.seletor}
                            onPress={() => setMostrarTipos(!mostrarTipos)}
                        >
                            <Text style={tipoSelecionado ? styles.seletorTexto : styles.seletorPlaceholder}>
                                {tipoSelecionado ? tipoItem : 'Selecione o tipo do item'}
                            </Text>
                        </TouchableOpacity>

                        {mostrarTipos && (
                            <View style={styles.listaPontos}>
                                {tiposItem.map((tipo) => (
                                    <TouchableOpacity
                                        key={tipo}
                                        style={styles.pontoItem}
                                        onPress={() => selecionarTipo(tipo)}
                                    >
                                        <Text style={styles.pontoNome}>{tipo}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {erroTipoItem !== '' && <Text style={styles.erro}>{erroTipoItem}</Text>}
                    </View>

                    {/* Campo descrição (bloqueado até escolher o tipo) */}
                    <View style={styles.campo}>
                        <Text style={styles.label}>Descrição</Text>

                        <TextInput
                            style={[styles.input, !tipoSelecionado && styles.inputDesabilitado]}
                            placeholder="Descreva o que está sendo doado"
                            value={descricao}
                            editable={tipoSelecionado}
                            onChangeText={validarDescricao}
                            multiline
                        />

                        {erroDescricao !== '' && <Text style={styles.erro}>{erroDescricao}</Text>}
                    </View>

                    {/* Campo quantidade (só números inteiros) */}
                    <View style={styles.campo}>
                        <Text style={styles.label}>Quantidade</Text>

                        <TextInput
                            style={[styles.input, !tipoSelecionado && styles.inputDesabilitado]}
                            placeholder="Apenas números inteiros"
                            keyboardType="numeric"
                            value={quantidade}
                            editable={tipoSelecionado}
                            onChangeText={validarQuantidade}
                        />

                        {erroQuantidade !== '' && <Text style={styles.erro}>{erroQuantidade}</Text>}
                    </View>

                    {/* ponto de destino = um TouchableOpacity por ponto da API, o escolhido fica destacado */}
                    <View style={styles.campo}>
                        <Text style={styles.label}>Ponto de destino</Text>

                        {carregandoPontos && <Text style={styles.dica}>Carregando pontos...</Text>}

                        {erroPontos !== '' && (
                            <>
                                <Text style={styles.erro}>{erroPontos}</Text>
                                <TouchableOpacity style={styles.botaoTentar} onPress={carregarPontos}>
                                    <Text style={styles.textoBotao}>Tentar novamente</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {pontosOrdenados.length > 0 && (
                            <ScrollView
                                style={[styles.listaPontosRolavel, !tipoSelecionado && styles.listaDesabilitada]}
                                nestedScrollEnabled
                                keyboardShouldPersistTaps="handled"
                            >
                                {pontosOrdenados.map((ponto) => {
                                    const escolhido = pontoSelecionado?.id === ponto.id;
                                    return (
                                        <TouchableOpacity
                                            key={ponto.id}
                                            disabled={!tipoSelecionado}
                                            style={[styles.pontoItem, escolhido && styles.pontoItemEscolhido]}
                                            onPress={() => selecionarPonto(ponto)}
                                        >
                                            <Text style={[styles.pontoNome, escolhido && styles.textoEscolhido]}>
                                                {ponto.nome}
                                            </Text>
                                            <Text style={[styles.pontoEndereco, escolhido && styles.textoEscolhido]}>
                                                {ponto.endereco}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        )}

                        {erroPontoDestino !== '' && <Text style={styles.erro}>{erroPontoDestino}</Text>}
                    </View>

                    {/* mensagem de erro da API (400 ou API desligada) */}
                    {erroEnvio !== '' && <Text style={styles.erroEnvio}>{erroEnvio}</Text>}

                    <TouchableOpacity
                        style={[styles.botao, enviando && styles.botaoDesabilitado]}
                        onPress={handleCadastrar}
                        disabled={enviando}
                    >
                        <Text style={styles.textoBotao}>
                            {enviando ? 'Enviando...' : modoEdicao ? 'Salvar alterações' : 'Cadastrar Doação'}
                        </Text>
                    </TouchableOpacity>

                    {modoEdicao && (
                        <TouchableOpacity style={styles.botaoCancelar} onPress={() => navigation.goBack()}>
                            <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                        </TouchableOpacity>
                    )}

                    {mensagemSucesso !== '' && <Text style={styles.sucesso}>{mensagemSucesso}</Text>}
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
    inputDesabilitado: { backgroundColor: '#eee', color: '#999' },
    seletor: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        minHeight: 44,
        justifyContent: 'center',
    },
    seletorTexto: { fontSize: 16, color: '#000' },
    seletorPlaceholder: { fontSize: 16, color: '#999' },
    dica: { fontSize: 13, color: '#666', marginBottom: 6 },
    erro: { color: '#d32f2f', fontSize: 13, marginTop: 4 },
    erroEnvio: { color: '#d32f2f', fontSize: 15, fontWeight: '600', textAlign: 'center', marginBottom: 8 },
    listaPontos: {
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    listaPontosRolavel: {
        maxHeight: 260,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    listaDesabilitada: { opacity: 0.5 },
    pontoItem: {
        padding: 12,
        minHeight: 44,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    pontoItemEscolhido: { backgroundColor: '#1B3A5C' },
    pontoNome: { fontSize: 15, fontWeight: 'bold', color: '#1B3A5C' },
    pontoEndereco: { fontSize: 13, color: '#666', marginTop: 4 },
    textoEscolhido: { color: '#fff' },
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
    botaoTentar: {
        backgroundColor: '#1B3A5C',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 8,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
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
    sucesso: {
        color: '#2e7d32',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 16,
    },
});