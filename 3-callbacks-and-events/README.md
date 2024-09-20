# Chapter 3 - CallBacks and Events

Programação assincrona: Ao invés de ter uma séries consecutiva de código a ser executado, algumas operações são processadas em background enquanto outras são executadas. Existem dois modos de fazer isso em Nodejs: Callback ou Evento.

Callback: Uma função que será chamada em runtime com o resultado de uma operação assincrona. É o bloco fundamental de toda funcionalidade assincrona no nodes como: Promises, streams e eventos.

Observer Pattern: Padrão que usa callbacks para lidar com diferentes eventos, é implementado pelo EventEmitter. É um padrão que define um objeto, chamado sujeito, que pode notificar alguns listeners quando ocorre uma mudança em seu estado. A diferença do CPS callback é que ele apenas propaga a execuação para apensar um listener: o callback.

Javascript e CallBack: É a linguagem ideal para callbacks pois as funções são first-class objects, são alocadas dinamicamente no heap e possui um ponteiro, que permite que ela seja guardada em variaveis e passada como argumentos para outras funções. E possui clousures, que permite que compartilhemos o contexto em que a função foi criada e podemos recupera-lo quando chamado como callback.

Event-Emmiter e Memory Leaks: É o maior causador de Memory Leaks em Nodejs, pois toda função registrada como listener de um eventEmitter, só tera sua memória deferenciada quando o objeto do EventEmmitr o for, e em casos como o eventEmmiter do Http, ele nunca é, fazendo com que todos os listeners fiquem permanentemente na memória, mesmo se não estão sendo usados.

Events VS Callbacks: A diferença é semântica, usamos aquele quando queremos informar que alguma coisa aconteceu, e esse quando o resultado será dado de modo assincrono.

Patterns:

- Sempre usar estilo direto e não CPS para funções puramente sincronas
- Usar implementações que sincronas que bloqueam o event-loop muita vezes, mas apenas quando ela não afeta a habilidade da aplicação de lidar com concorrentes operações assincronas
- Uma uncaugthExeception precisa sempre terminar o processo pois ela faz com que a stack fique inconsistente e pode travar operações I/O no meio. É preciso aplicar o padrão fail-fast para terminar a aplicação e iniciar outra rapidamente.
