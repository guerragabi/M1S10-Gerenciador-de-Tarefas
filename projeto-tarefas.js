const express = require ("express")
const app = express()
const port = 3333
const tarefas = []

app.use(express.json())

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})

//middleware para validação de dados
const validarDados = (req, res, next) => {
    const { titulo, descricao, dataConclusao } = req.body

    //verifica se os campos obrigatórios estão preenchidos
    if (!titulo || !descricao || !dataConclusao) {
        return res.status(400).json({ mensagem: 'Campos obrigatórios: titulo, descricao, dataConclusao' })
    }

     //verifica se a data de conclusão está no formato correto (YYYY-MM-DD)
     const dataConclusaoRegex = /^\d{4}-\d{2}-\d{2}$/;
     if (!dataConclusaoRegex.test(dataConclusao)) {
         return res.status(400).json({ mensagem: 'Formato de data de conclusão inválido. Use o formato YYYY-MM-DD.' })
     }

    //verifica se a data de conclusão está no futuro
    const hoje = new Date()
    const dataConclusaoDate = new Date(dataConclusao)
    if (dataConclusaoDate <= hoje) {
        return res.status(400).json({ mensagem: 'A data de conclusão deve ser no futuro.' })
    }

    //se os dados forem válidos, chama o próximo middleware ou rota
    next()
}

//rota post para criar nova tarefa
app.post('/tarefas', validarDados, (req, res) => {
    const { titulo, descricao, dataConclusao } = req.body  
    const tarefa = { titulo, descricao, dataConclusao}
    tarefa.id = tarefas.length > 0 ? tarefas[tarefas.length -1].id + 1 : 1  
    tarefas.push(tarefa)
    res.status(201).json({"Tarefa criada:": tarefa})
})

//rota get para listar todas as tarefas na lista
app.get('/tarefas', (req, res) => {
    res.json(tarefas)
})

//rota put para atualizar tarefas existentes
app.put('/tarefas/:id', (req, res) => {
    const {id} = req.params
    const novosDados = req.body 
    const index = tarefas.findIndex(tarefa => tarefa.id === parseInt(id)) 
    if (index === -1){ 
        res.status(404).send("Tarefa não encontrada.")
        return
    }
    tarefas[index] = {...tarefas[index], ...novosDados} 
    res.status(200).json({"Tarefa atualizada:": tarefas[index]})
})

//rota delete para remover tarefas pelo id
app.delete('/tarefas/:id', (req, res) => {
    const {id} = req.params
    const index = tarefas.findIndex(tarefa => tarefa.id === parseInt(id)) 
    if (index === -1){ 
        res.status(404).send("Tarefa não encontrada.")
        return
    }
    const tarefaRemovida = tarefas.splice(index, 1)[0] 
    res.status(200).json({"Tarefa removida:": tarefaRemovida})
})
