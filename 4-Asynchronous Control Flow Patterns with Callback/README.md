# Chapter 4 - Asynchronous Controler Flow Patterns With CallBacks

CallBack discipline:

- Evitar CallBack Hell
- Tomar cuidado com Memory Leaks já que as clousers mantem todo seu contexto em memória, mesmo de variaveis de funções não mais utilizadas.

Sequential Execution Flows:

- Sequential Know: O output de uma task é o input de outra
- Sequential Iterator: Iterando uma lista enquanto roda uma task assincrona em cada elemento, um atrás do outro, cada callback chama a proxima execução.
- Unlimited Parallel execution: As taks não são conhecidas previamente e não existe propagação de dados entre elas, podendo ser executadas em paralelo
- Limited Parallel execution:
