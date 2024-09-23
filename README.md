# Estudo - NodeJs Design Patterns

Objetivo: Guiar-nos pelos melhores design patterns para resolver problemas comuns no NodeJs.

Principios do Nodejs:

- Pequenas funcionalidades no core, deixando implementações para serem feitas pela comunidade
- Small is beutiful
- Make each program do one thing well
- Facilidade de usar outros modulos desenvolvidos por outras pessoas pelo Yarn e Npm
- Simplicidade na arquitetura, ao invés de ter um paradigma de OPP muito engessado que tenta ter um design perfeito

## Como NodeJs Funciona

I/O é uma das operações mais lentas de um computador, por sua indefinição.

Solução padrão de Block de I/O: Criar uma thread por requisição, porém isso custa bastante memória e também, como uma thread tem varios I/O blocks, ficar trocando de thread, fazendo varios context-switchs, é custoso em termos de CPU.

Sistema operacional modernos oferecem funções para lidar com I/O de forma non-blocking, não retornando o resultado da operação na hora da chamada da função, mas sim quando o recurso está disponivel.

Modos de lidar com funções não-blocking I/O:

- Busy waiting: Ficar fazendo varias chamadas para as funções até receber o resultado esperado
- Syncronous event demultiplexer: Observar multiplos resources e retorna novos eventos, e enquanto ele não recebe mais eventos ele trava a execução por ser sincrono. Assim podemos usar apenas uma thread e lidar com varios pedidos de I/O sem bloquear a thread principal, só faremos uma ação quando recebermos os eventos daqueles I/O's, enquanto isso podemos processar outras coisas.
- React Pattern: É uma especialização do algoritimo acima, porém ele atribui um handle, callback, a uma operação de I/O especifica. Esse handler será chamado assim que um evento relacionado a sua operação for chamado. E os eventos serão colocados em uma fila quanto tiverem pronto pelo demultiplexer, que será lida pelo event-loop e executado o seu handler. O código só para de rodar quando não existem mais operações cadastradas no event demultiplexer. Esse é padrão que esta no coração do NodeJs.

Beneficios de Usar o Event-Loop Vs Multhreading:

- Performance: pois não ficamos gastando memória criando outras threads e cpu alternando-se entre elas, e elas não ficam muito tempo sem executar.
- Simplicidade: Simplifica a lidar com concorrência e race-conditions

LibUv: Abstração para lidar com os diferentes modos dos sistemas operacionais fornecerem funções non-blocking de I/O. Além de abstrair system-calls também implementa o reactor pattern, e fornece uma api para criar event loops, lidar com o event-queue, e etc.

Arquitetura do NodeJs:

- V8: Javascript engine escrita pelo Google para o Chrome interpretar javascript
- LibUv: Abstração para lidar implementar o event-loop em diversos sistema operacionais
- Bindings: Bindings que expoe a libuv e outras funcionalidades low-level para o javascript
- Core Javascript Api: A blibioteca de javascript que implementa as principais funcionalidades high-level do Nodejs
- UserLand Modules: Blibiotecas dos usuarios
