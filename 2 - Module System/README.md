# Estudo - Chapter 2 - Module System of Nodejs

Modulos: Permite você dividir sua aplicação em pedaços pequenos que podem ser executados e testados independentemente. E permite que suas funções sejam escondidas, e somente as marcadas com export poderão ser acessadas por outros arquivos.

Module System do Nodejs: Ele se baseia nos arquivos diponiveis no seu file-system.

CommonJs: Primeiro module-system utilizado. Possui a keywork require e exports, para pegar funcionalidades de um arquivo. Ele executa o arquivo em uma IFEE, e passa um objeto de module para ser manipulado por esse arquivo, que coloca suas funções para serem expostas na propridade exports. O require é sincro, então não conseguimos exportar por ele variaveis calculadas assincronamente em outro arquivo. Como precisamos executar o código para exporta-lo, também existe um sistema de chache, em que, quando um modulo é exportado, ele não precisa ser executado denovo, pois ele está em cache. O que permite também que uma instancia já instanciada, por estar em cache, é compartilhada entre requires.

Dependency Hell: Um ou mais arquivos tem uma dependencia semelhante, porém a precisam em diferente versões. Isso é resolvido pelo modo que o yarn e npm lidam com dependencias, eles sempre instalam dependencias privadas para cada modulo. Portanto o algoritimo do Nodejs sempre verifica as dependencias na pasta raiz do projeto e vai descendo no filesystem até achar a dependencia. Isso permite com que tenhamos muitas dependencias que não tem colisão entre si.

ECMAScript modules: Padrão definido no ECMAScript 2015, para padronizar um module system para diferentes ambientes de execução. A maior diferença entre o CommonsJs é que os imports são static, não podem ser colocados dentro de fluxos de controle e nem ter nomes dinamicos que são definido em runtime, e isso porque ele precisa resolver o grafo de dependencias antes de executar qualquer código. Porém ele fornece uma função import que é dinamica e retorna uma promisse com o module inserido. As variaveis exportadas não podem ser modificadas no código importador, somente no contexto em que foram criadas, apenas com objetos se pode faze-lo.

Passos do Interpretrador no ECMAScript Modules:

- Percorre todos os imports e mapeia em uma arvore
- Percorre a arvore e instancia todos os exports dos arquivos
- Linka as variaveis atreladas a imports com os objetos instanciados mas sem colocar valores
- O interpretador percorre a arvore bottom-up e executa o código dos arquivo, preenchendo os objetos de export
