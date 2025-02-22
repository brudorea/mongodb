/**
 * Processo principal
 * Estudo do CRUD com o MongoDB
 */
 
//importação do módulo de conexão (database)
const { conectar, desconectar } = require('./database.js')
 
//importação do moedelo de dados de clientes
const clienteModel = require('./src/models/Clientes.js')

//importação do pacote string-similarity para aprimorar a busca por nome
const stringSimilarity = require('string-similarity')
 
//CRUD Create (função para adicionar um novo cliente)
const criarCliente = async (nomeCli, foneCli, cpfCli) => {
    try {
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpf: cpfCli
            }
        )
 
        //a linha abaixo salva os dados do cliente no banco
        await novoCliente.save()
        console.log("Cliente adicionado com sucesso ")
    } catch (error) {
        // tratamento de exceções específicas 
        if (error.code = 11000) {
            console.log(`Erro: O CPF ${cpfCli} já está cadastrado`)
        } else {
        console.log(error)
        }
    }
}

// CRUD Read - Função para listar todos os clientes cadastrados 
const listarClientes = async () => {
    try {
        // a linha abaixo lista todos os clientes cadastrados em ordem alfabética
        const clientes = await clienteModel.find().sort(
            {
                nomeCliente: 1
            }
        )
        console.log(clientes)
    } catch (error) {
        console.log(error)
    }   
}

// CRUD Read - Função para buscar um cliente específico
const buscarCliente = async (nome) => {
    try {
        // find() buscar
        // nomeCliente: new RegExp (nome) filtrar pelo nome (partes que contenham (expressão regular))
        // 'i' insensitive (ignorar letras maiúscula ou minúsculas)
        const cliente = await clienteModel.find(
            {
                nomeCliente: new RegExp(nome, 'i')
            }
        )

    // calcular a similaridade entre nomes retornados e o nome pesquisado
    const nomesClientes = cliente.map(cliente => cliente.nomeCliente)

    // validação (se nao existir o cliente pesquisado)
    if (nomesClientes.length === 0) {
        console.log("Cliente não cadastrado")
    } else {
        const match = stringSimilarity.findBestMatch(nome, nomesClientes)
    // cliente com melhor similaridade
    const melhorCliente = cliente.find(cliente => cliente.nomeCliente === match.bestMatch.target)

    // formatação da data
    const clienteFormatado = {
        nomeCliente: melhorCliente.nomeCliente,
        foneCliente: melhorCliente.foneCliente,
        cpf: melhorCliente.cpf,
        dataCadastro: melhorCliente.dataCadastro.toLocaleDateString('pt-BR')
        }
        console.log(clienteFormatado)
    }

    } catch (error) {
        console.log(error)
    }
}

//execução da aplicação
const app = async () => {
    await conectar()
    // CRUD - Create
    // await criarCliente("Senhor Wesley", "99999-0000","12345678901")

    // CRUD - Read (Exemplo 1 - listar todos os clientes)
    // await listarClientes()

    // CRUD - Read (Exemplo 2 - buscar cliente)
    await buscarCliente("Bruno Henrique")

    await desconectar()
}
 
console.clear()
app()
