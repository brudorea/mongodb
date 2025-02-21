/**
 * Processo principal
 * Estudo do CRUD com o MongoDB
 */
 
//importação do módulo de conexão (database)
const { conectar, desconectar } = require('./database.js')
 
//importação do moedelo de dados de clientes
const clienteModel = require('./src/models/Clientes.js')
 
//CRUD Create (função para adicionar um novo cliente)
const criarCliente = async (nomeCli, foneCli) => {
    try {
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli
            }
        )
 
        //a linha abaixo salva os dados do cliente no banco
        await novoCliente.save()
        console.log("Cliente adicionado com sucesso ")
    } catch (error) {
        console.log(error)
    }
}
 
//execução da aplicação
const app = async () => {
    await conectar()
    await criarCliente("Leandro Ramos", "99999-0000")
    await criarCliente("Jose de Assis", "99999-0000")
    await criarCliente("Sirlene Sanches", "99999-0000")
    await criarCliente("Robson Vaamonde", "99999-0000")
    await desconectar()
}
 
console.clear()
app()