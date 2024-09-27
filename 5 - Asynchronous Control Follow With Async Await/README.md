# Chapter 5 - Asynchronouns Control Follow With Async/Await

Solução para sequential execution async: Um dos principais control follows usado em Nodejs é o serial execution async. Porém escreve-lo com callbacks é muito complexo e verboso, e também pode acarretar a uma serie de erros quando não lidamos com excessões ou esquecemos de tornar uma função async. A solução para isso foi criar promisses

Promise: Um objeto que carrega o status e o resultado de uma operação assincrona. Porém ainda era muito verbosa então criaram a syntax sugar do async/await para lidar com o serial execution flow, que faz com que o código async se pareça sincrono.

Beneficios de Promise:

- Elas permitem um encadeamento sincrono de promises, fazendo com que error possam ser lidados em um unico entry point e com que o código fique mais limpo e claro.
- Transforma todas as promises em funções asyncs que saem de execução da thread principal, garantindo a asincronicidade de todas as funções e mitigando surpresas em suas chamadas

Duck Typing: Uma técnica de tipagem de objeto que o define baseado no seu comportamento exterior. Promises são definidas por ter seu método then.

Async/Await: Cada declaração de await em uma função async faz com que a execução da função fique em pausa e saia do event-loop, e assim que o resultado é resolvido pela promise esperada, ela terá sua variavel preenchida na proxima execução do event-loop. O maior beneficio de usar a sintaxe de async/await é poder lidar com erros usando try/catch

Memory Leaks: Não é possivel retornar uma promise recursiva, pois ela criará objetos de promise infinitos que nunca serão resolvidos, fazendo a memória crescer indefinidamente.
