import { useEffect, useState } from 'react';
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
import type { Doacao, Ponto, RootStackParamList } from '../tipos';
import { pontosMock } from '../dados/Pontos';
import { tiposItem } from '../dados/TiposItem';
import { salvarDoacao, atualizarDoacao, carregarRascunho, salvarRascunho } from '../dados/Doacoes';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroDoacao'>;

// FORMULÁRIO ÚNICO: serve para CADASTRAR uma doação nova e para EDITAR uma existente.
export default function CadastroDoacao({ route, navigation }: Props) {
    // Issue #11: se a tela recebeu uma doação pela navegação, está em modo edição.
    const doacaoEditando = route.params?.doacao;
    const modoEdicao = doacaoEditando !== undefined;

    // Campos do formulário. Issue #11: na edição já começam preenchidos com os dados da doação.
    const [tipoItem, setTipoItem] = useState(doacaoEditando?.tipoItem ?? '');
    const [quantidade, setQuantidade] = useState(doacaoEditando?.quantidade ?? '');
    const [pontoDestino, setPontoDestino] = useState(doacaoEditando?.pontoDestino ?? '');
    const [descricao, setDescricao] = useState(doacaoEditando?.descricao ?? '');

    // Mensagens de erro de cada campo (vazias quando está tudo certo)
    const [erroTipoItem, setErroTipoItem] = useState('');
    const [erroQuantidade, setErroQuantidade] = useState('');
    const [erroPontoDestino, setErroPontoDestino] = useState('');
    const [erroDescricao, setErroDescricao] = useState('');

    // Ponto escolhido na lista 
    const [pontoSelecionado, setPontoSelecionado] = useState<Ponto | null>(
        doacaoEditando
            ? pontosMock.find((p) => p.nome === doacaoEditando.pontoDestino) ?? null
            : null
    );
    const [mostrarPontos, setMostrarPontos] = useState(false);
    const [mostrarTipos, setMostrarTipos] = useState(false); 
    const [carregado, setCarregado] = useState(false);
    const [mensagemSucesso, setMensagemSucesso] = useState('');

    // Os outros campos só liberam depois que o tipo do item é escolhido
    const tipoSelecionado = tipoItem.trim() !== '';

    // RASCUNHO (só no cadastro novo): ao abrir, recupera o que a pessoa já tinha preenchido
    useEffect(() => {
        if (modoEdicao) return;

        (async () => {
            const r = await carregarRascunho();
            if (r) {
                setTipoItem(r.tipoItem);
                setQuantidade(r.quantidade);
                setPontoDestino(r.pontoDestino);
                setDescricao(r.descricao ?? '');
                setPontoSelecionado(
                    pontosMock.find((p) => p.id === r.pontoId) ?? null
                );
            }
            setCarregado(true);
        })();
    }, []);

    // RASCUNHO: a cada mudança nos campos, salva o estado atual
    useEffect(() => {
        if (!carregado || modoEdicao) return;
        const vazio = !tipoItem && !quantidade && !pontoDestino && !descricao;
        salvarRascunho(
            vazio
                ? null
                : {
                    tipoItem,
                    quantidade,
                    pontoDestino,
                    pontoId: pontoSelecionado?.id ?? null,
                    descricao,
                }
        );
    }, [carregado, tipoItem, quantidade, pontoDestino, pontoSelecionado, descricao]);

    // Faz a mensagem de sucesso sumir sozinha depois de 1 segundo
    useEffect(() => {
        if (mensagemSucesso === '') return;

        const timer = setTimeout(() => setMensagemSucesso(''), 1000);
        return () => clearTimeout(timer);
    }, [mensagemSucesso]);

    // ---------- VALIDAÇÕES ----------

    // Tipo do item: precisa estar selecionado
    function validarTipoItem(valor: string) {
        setTipoItem(valor);

        if (valor.trim() === '') {
            setErroTipoItem('Selecione o tipo do item.');
            return;
        }

        setErroTipoItem('');
    }

    function selecionarTipo(tipo: string) {
        validarTipoItem(tipo);
        setMostrarTipos(false);
    }

    // Quantidade: não pode ser vazia e deve ser um número inteiro
    function validarQuantidade(valor: string) {
        setQuantidade(valor);

        if (valor.trim() === '') {
            setErroQuantidade('Informe a quantidade.');
            return;
        }

        if (!/^\d+$/.test(valor)) {
            setErroQuantidade('Quantidade deve ser um número inteiro.');
            return;
        }

        setErroQuantidade('');
    }

    // Descrição: não pode ser vazia
    function validarDescricao(valor: string) {
        setDescricao(valor);

        if (valor.trim() === '') {
            setErroDescricao('Informe uma descrição para o item.');
            return;
        }

        setErroDescricao('');
    }

    // Ponto de destino: deve ter sido escolhido na lista (não vale só digitar o nome)
    function validarPontoDestino() {
        if (pontoSelecionado === null) {
            setErroPontoDestino('Selecione um ponto de destino.');
            return false;
        }

        setErroPontoDestino('');
        return true;
    }

    function selecionarPonto(ponto: Ponto) {
        setPontoDestino(ponto.nome);
        setPontoSelecionado(ponto);
        setMostrarPontos(false);
    }

    // Lista de pontos para escolher
    const pontosFiltrados = [...pontosMock]
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
        .filter((ponto) =>
            ponto.nome
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .includes(pontoDestino.toLowerCase())
        );

    // ---------- SALVAR ----------
    // Cadastra uma doação nova OU salva as alterações de uma existente
    async function handleCadastrar() {
        setMensagemSucesso('');

        // Roda todas as validações para mostrar todos os erros de uma vez
        validarTipoItem(tipoItem);
        validarQuantidade(quantidade);
        validarDescricao(descricao);

        const pontoValido = validarPontoDestino();

        // Se algum campo estiver inválido, para aqui e não salva nada
        if (
            tipoItem.trim() === '' ||
            quantidade.trim() === '' ||
            !/^\d+$/.test(quantidade) ||
            descricao.trim() === '' ||
            !pontoValido
        ) {
            return;
        }

        // Issue #11: EDIÇÃO. Mantém o mesmo id (...doacaoEditando) e atualiza a doação existente,
        if (doacaoEditando) {
            const atualizada: Doacao = {
                ...doacaoEditando,
                tipoItem: tipoItem.trim(),
                quantidade: quantidade.trim(),
                pontoDestino: pontoSelecionado!.nome,
                descricao: descricao.trim(),
            };

            const ok = await atualizarDoacao(atualizada);
            if (!ok) return;

            navigation.popTo('DetalheDoacao', {
                doacao: atualizada,
                mensagem: `Doação nº ${atualizada.id} editada com sucesso!`,
            });
            return;
        }
        // Salva o cadastro novo
        const novaDoacao = await salvarDoacao({
            tipoItem: tipoItem.trim(),
            quantidade: quantidade.trim(),
            pontoDestino: pontoSelecionado!.nome,
            descricao: descricao.trim(),
        });

        if (!novaDoacao) return;

        setMensagemSucesso(`Doação nº ${novaDoacao.id} cadastrada com sucesso!`);

        // Limpa o formulário para um novo cadastro
        setTipoItem('');
        setQuantidade('');
        setPontoDestino('');
        setDescricao('');
        setPontoSelecionado(null);
        setMostrarTipos(false);

        setErroTipoItem('');
        setErroQuantidade('');
        setErroPontoDestino('');
        setErroDescricao('');
    }

    return (
        <SafeAreaView
            style={styles.container}
            edges={['bottom', 'left', 'right']}
        >
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

                        {erroTipoItem !== '' && (
                            <Text style={styles.erro}>{erroTipoItem}</Text>
                        )}
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

                        {erroDescricao !== '' && (
                            <Text style={styles.erro}>{erroDescricao}</Text>
                        )}
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

                        {erroQuantidade !== '' && (
                            <Text style={styles.erro}>{erroQuantidade}</Text>
                        )}
                    </View>

                    {/* Campo ponto de destino (digita para filtrar e escolhe na lista) */}
                    <View style={styles.campo}>
                        <Text style={styles.label}>Ponto de destino</Text>

                        <TextInput
                            style={[styles.input, !tipoSelecionado && styles.inputDesabilitado]}
                            placeholder="Selecione um ponto de doação"
                            value={pontoDestino}
                            editable={tipoSelecionado}
                            onFocus={() => setMostrarPontos(true)}
                            onChangeText={(texto) => {
                                setPontoDestino(texto);
                                setPontoSelecionado(null); 
                                setErroPontoDestino('');
                                setMostrarPontos(true);
                            }}
                        />

                        {mostrarPontos && pontoSelecionado === null && (
                            <View style={styles.listaPontos}>
                                {pontosFiltrados.map((ponto) => (
                                    <TouchableOpacity
                                        key={ponto.id}
                                        style={styles.pontoItem}
                                        onPress={() => selecionarPonto(ponto)}
                                    >
                                        <Text style={styles.pontoNome}>
                                            {ponto.nome}
                                        </Text>

                                        <Text style={styles.pontoEndereco}>
                                            {ponto.endereco}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {erroPontoDestino !== '' && (
                            <Text style={styles.erro}>
                                {erroPontoDestino}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.botao}
                        onPress={handleCadastrar}
                    >
                        <Text style={styles.textoBotao}>
                            {modoEdicao ? 'Salvar alterações' : 'Cadastrar Doação'}
                        </Text>
                    </TouchableOpacity>

                    {modoEdicao && (
                        <TouchableOpacity
                            style={styles.botaoCancelar}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                        </TouchableOpacity>
                    )}

                    {mensagemSucesso !== '' && (
                        <Text style={styles.sucesso}>{mensagemSucesso}</Text>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    flex: {
        flex: 1,
    },

    scrollContent: {
        padding: 24,
        flexGrow: 1,
    },

    campo: {
        marginBottom: 16,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },

    inputDesabilitado: {
        backgroundColor: '#eee',
        color: '#999',
    },

    seletor: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        minHeight: 44, 
        justifyContent: 'center',
    },

    seletorTexto: {
        fontSize: 16,
        color: '#000',
    },

    seletorPlaceholder: {
        fontSize: 16,
        color: '#999',
    },

    dica: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
    },

    erro: {
        color: '#d32f2f',
        fontSize: 13,
        marginTop: 4,
    },

    listaPontos: {
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },

    pontoItem: {
        padding: 12,
        minHeight: 44, 
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    pontoNome: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1B3A5C',
    },

    pontoEndereco: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },

    botao: {
        backgroundColor: '#2e7d32',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        minHeight: 44, 
    },

    textoBotao: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

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

    textoBotaoCancelar: {
        color: '#333333',
        fontWeight: 'bold',
        fontSize: 16,
    },

    sucesso: {
        color: '#2e7d32',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 16,
    },
});