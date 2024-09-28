# Chapter 6 - Streams

Definição: É uma das features mais louvadas do NodeJs, porém uma das mais incrompreendidas.

Importância: Em uma plataforma baseada em eventos, o jeito mais eficiente de lidar com I/O é em tempo real, consumindo o input assim que ele está disponivel e mandando um output.

Buffering Vs Stream: Uma função espera o buffer inteiro ficar pronto para enviar para um consumer. Já com Streams ela pode ir enviando pedaços para ele.

Beneficios de Streams:

- Gasta menos Memória: Colocar arquivos grandes em memória rapidamente acabarão com a memória do processo, com streams só colocamos o pedaço que estamos processando. Forçara um uso constante de memória para essa operação.
- Gasta menos CPU: A implementação dos Pipes são assincronas, então conforme os dados vão chegando nas streams, eles podem ser processados ao mesmo tempo que outros chunks são tratados. O Nodejs só se encarrega de no final enviar tudo em sequencia.
- Composability: Com o método Pipe, qualquer api que implemente streams conseguem ser encadeadas de forma limpa e clara, o unico requisito é a função que recebe a stream conseguir processor o tipo de dado que está recebendo.

Anatomia de Streams: Cada Stream é uma instancia do EventEmitter, de modo que produzem eventos dos seus estados. Elas possuem dois modos de operação, um binário, em que trafega os dados em forma de chunks como buffers ou strings; e um de objeto, que pode transportar qualquer tipo de valor do javascript. É importante definir o tipo de dados ao ler uma stream para ela saber como os chunks deverão ser trafegados, em quantos bytes eles deverão ser agrupados.

Classes de Streams:

- Readable: Uma fonte de dados, que pega dados de algum lugar e os fornece de modo fluído ou não fluido, de modo passivo ou ativo.
- Writable: Destino de dados o qual receberá os chunks e passará para o seu destino.
- Duplex: Uma stream que é Readable e Writable, uma fonte de dados e um destino de dados. Sua implementação deriva das duas interfaces, Readable and Writable.
- Transform: Um tipo especial de Duplex Stream que transformar os dados que lhe são lidos ou escritos.

Backpressure: Técnica usada quando um recurso não está conseguindo processar os recursos que mandamos para ele, então precisamos parar de manda-lo, e assim que vermos que nossos recursos estão sendo consumidos, voltar a envia-los. O método write retorna um booleano indicando que o buffer interno atingiu seu limite, devemos consumi-lo e respeitalo para não crescer o buffer muito na memória. As readables streams também o possui, quando o método push do buffer interno retorna false.
