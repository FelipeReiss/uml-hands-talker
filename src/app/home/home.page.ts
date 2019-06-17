import { UserFirestoreClass } from './../auth/classes/UserFirestoreClass.class';
import { UserService } from './../auth/services/user.service';
import { WordsService } from './../words/services/words.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'node_modules/rxjs';
import { OverlayService } from '../core/services/overlay.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { Word } from '../words/models/word.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  public searchTerm = '';
  words$: Observable<Word[]>;
  error = false;
  messageError: string;
  searchForm: FormGroup;
  sentence: string;
  userApp;
  userLogado = false;
  userAdmin = false;
  isWord = 'Words';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private wordsService: WordsService,
    private overlayService: OverlayService,
    private navCtrl: NavController
  ) { }

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    this.authService.authState$.subscribe(async user => {
      this.authService.setUserFire(user);
      if (user) {
        this.userLogado = true;
        this.authService.updateUserFireClass(this.userService);
        await this.timeOut(1000).then(() => this.userAdmin = this.authService.getUserFireClass().admin
        );
      }
      this.updateList();
    });
    this.userApp = this.authService.getUserFireClass();
    this.createForm();
    this.words$ = null;
    try {
      this.words$ = this.wordsService.getAll();
    } catch (error) {
      this.error = true;
      this.messageError = error.message;
    } finally {
      loading.dismiss();
    }
  }

  onUpdate(word: Word): void {
    this.navCtrl.navigateForward(`/tabs/home/edit-word/${word.id}`);
  }

  onOpen(word: Word): void {
    this.navCtrl.navigateForward(`/tabs/home/show-word/${word.id}`);
  }

  async onDelete(word: Word): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar o termo "${word.title}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            const loading = await this.overlayService.loading({
              message: `Deletando "${word.title}" do banco de dados...`
            });
            try {
              await this.wordsService.delete(word);
              let allUsers: Observable<{}[]>;

              this.userService
              .searchArray('/users', 'favoritesWords', word.id)
              .subscribe(valor => {
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < valor.length; i++) {
                  const userFormat = valor[i] as UserFirestoreClass;
                  userFormat.favoritesWords.splice(userFormat.favoritesWords.indexOf(word.id), 1);
                  this.userService.update(userFormat);
                }
              });
              await this.overlayService.toast({
                message: `Termo "${word.title}" deletado com sucesso!`
              });
            } catch (error) {
              await this.overlayService.alert({
                message: `Não foi possivel deletar termo "${word.title}". Favor encaminhar feedback com o erro abaixo: \n${error.message}`,
                buttons: ['OK']
              });
            } finally {
              loading.dismiss();
            }
          }
        },
        'Não'
      ]
    });
  }

  timeOut(time: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(time);
      }, time);
    });
  }

  ionViewWillEnter() {
    this.isWord = 'Words';
    this.authService.isAuthenticated.pipe(take(1)).subscribe( isAuth => {
      if (isAuth) {
        this.authService.updateUserFireClass(this.userService);
      } else {
        this.authService.setUserFireClass(undefined);
      }
    });
  }

  async ionViewDidEnter() {
    const loading = await this.overlayService.loading({
      message: 'Atualizando lista de termos...'
    });
    await this.timeOut(500)
    .then(() => {
      this.searchForm.get('searchTerm').setValue('');
      this.authService.isAuthenticated.pipe(take(1)).subscribe( isAuth => {
        this.userLogado = isAuth;
        if (isAuth) {
          this.userAdmin = this.authService.getUserFireClass().admin;
        }
      });
      loading.dismiss();
    });
  }

  async onChangeFav(word: Word): Promise<void> {
    const userLocal = this.authService.getUserFireClass();
    const index = userLocal.favoritesWords.indexOf(word.id);
    this.userService.get(userLocal.id).pipe(take(1)).subscribe( valor => {
      const userFormat = valor as UserFirestoreClass;
      if (index < 0 ) {
        userFormat.favoritesWords.push(word.id);
      } else {
        userFormat.favoritesWords.splice(index, 1);
      }
      this.userService.update(userFormat);
      this.authService.updateUserFireClass(this.userService);
      this.updateList();
    });
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: ''
    });
  }
  onSearchInput() {
    this.sentence = this.searchForm.get('searchTerm').value;
  }

  public updateList() {
    this.ionViewWillEnter();
    this.ionViewDidEnter();
  }

  async onReset() {
    const loading = await this.overlayService.loading({
      message: 'Subindo seus dados padrões...'
    });

    const allWords = this.resetFirebase();

    try {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < allWords.length; i++) {
        this.wordsService.create({
          id: undefined,
          done: false,
          title: allWords[i][0],
          description: allWords[i][1],
          link: allWords[i][2]
        });
      }
    } catch (e) {
      this.overlayService.toast({
        message: e.message
      });
    } finally {
      loading.dismiss();
    }
  }

resetFirebase() {
    const array = [];
// tslint:disable-next-line: max-line-length
    array.push(['Ator', 'É algo ou alguém que representa alguma ação que ocorre no sistema, como por exemplo uma pessoa usando o aplicativo ou outro sistema utilizando alguma função disponível do aplicativo.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Papel', 'É aquilo que o Ator representa dentro do sistema, buscando representar uma situação ou condição real. Por exemplo, uma pessoa utilizando o software pode representar mais de um papel.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Caso de Uso', 'É uma situação que ocorre no sistema representando a interação entre um Ator e o sistema', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Cenário', 'É uma situação que leva a uma sequencia de funcionamento do sistema. É possível um mesmo caso de uso estar em diferentes cenários e possuir diferentes formas de funcionamento. ', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Diagrama de Caso de Uso', 'É um diagrama que explica um conjunto de “Casos de Uso” e a relação de cada um com um determinado Ator ou atores do sistema, ou seja, descreve cada situação que ocorre no sistema bem como os atores envolvidos ', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Classe', 'É a representação do manual para chegar há algo real e concreto dentro do universo do sistema, ou seja, se existe um objeto cachorro, com todas as suas características, propriedades e ações como cor do pelo, temperamento e latidos por exemplo, então a classe é s junção de todas essas “configurações” escritas em um tipo de “receita” para gerar um cachorro.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Diagrama de Classes', 'É um diagrama que explica todos os tipos de classes existentes em um sistema, ou seja, descreve como cada classe é, qual seu tipo, quais são suas características, propriedades e operações. Além disso também explica como as classes se relacionam', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Objeto', 'É a representação de algo real e concreto dentro do universo do sistema, ou seja, se existe uma classe cachorro, o objeto será o cachorro em si. Em outras palavras, é quando uma classe é transformada em um objeto.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Atributos', 'É a representação das características de um objeto dentro de uma classe, por exemplo, um homem tem altura, cor do cabelo, cor da pele e etc. Dentro do universo do sistema existiria uma classe e todas essas características citadas seriam seus atributos.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Métodos', 'É a representação das ações de um objeto dentro de uma classe, por exemplo, um homem fala, corre, pula e etc. Dentro do universo do sistema existiria uma classe e todas essas ações citadas seriam seus métodos.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Encapsular', 'É quando o acesso a qualquer característica da classe, ou seja, seus atributos, só são permitidos através dos  métodos da própria classe, isso garante que só será acessado ou alterado aquilo que a classe permitir, trazendo mais segurança. ', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Diagrama de Objetos', 'É um diagrama que explica um grupo de objetos se relacionando em determinado momento do sistema, ou seja, descreve como os objetos se relacionam quando ocorre uma situação especifica', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Diagrama de Interação', 'É um diagrama que  explica como os objetos do sistema interagem uns com os outros, explicando seus relacionamentos e interações. Ele e dividido em 4: Diagrama de Sequência, Diagrama de Comunicação ou Colaboração, Diagrama de Visão Geral de Interação e Diagramas de Tempo.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Diagrama de Tempo', 'E um dos chamados “Diagrama de Interação”, este é um diagrama em que representa a situação do sistema em um determinado tempo, podendo ser apenas a duração de uma mensagem ou condição que gera uma mudança no sistema.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Diagrama de Comunicação ou Colaboração', 'E um dos chamados “Diagrama de interação”, este explica a relação entre os objetos, sendo que o mais importante aqui é mostrar a organização estrutural dos objetos', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Diagrama de Sequências', 'E um dos chamados “Diagrama de interação”, este explica passo a passo a troca de dados ou mensagens entre objetos durante uma determinada situação', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Classes Associativas', 'É uma classe que é gerada a partir da relação de outras duas classes. Ela só se faz necessária enquanto existir uma relação entre as principais.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Pacote', 'O pacote é um grupo de classes, utilizado para organizar os diagramas de classe de sistemas com um numero muito alto de classes.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Diagrama de Pacotes', 'É um diagrama que explica como os pacotes do sistema interagem uns com os outros', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Herança', 'Quando diferentes classes possuem características ou propriedades similares é possível agrupar essas semelhanças em  uma “super Classe”, sendo assim as outras classes passariam a ter uma relacionamento de herança, ou seja, todas elas receberiam as características e propriedades da “Super Classe”.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Generalização', 'É o nome dado a representação gráfica da relação de “Herança” em um Diagrama.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Associação', 'É o nome dado a relação entre classes ou objetos de um sistema, podendo ser de: agregação, composição e reflexiva.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Associação de Agregação', 'É uma associação em que os objetos ou classes são independentes, porem podem trabalhar juntos se necessário ', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Estende ou Extend', 'É o nome dado a representação gráfica da “Associação de Agregação” em um Diagrama.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Associação de Composição', 'É uma associação em que os objetos ou classes são dependentes e devem trabalhar juntos ', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Incluir ou Include', 'É o nome dado a representação gráfica da “Associação de Composição” em um Diagrama.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Associação Reflexiva', 'É uma associação em que os objetos da mesma classe interagem entre si ', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Realização', 'É uma relação entre classes ou objetos  em que tem mais de uma classe ou objeto envolvidos, sendo que a relação da primeira é garantida pela relação da segunda com a terceira. Normalmente utilizado para interfaces.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Persistência', 'É quando os dados da classe ou do sistema serão preservados de alguma forma. Usado em modelos de bancos de dados.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Instância de Classe', 'Quando o sistema necessita de algum objeto é chamada a classe deste objeto e é feito uma “instancia”, ou seja, é quando o objeto é criado a partir de sua classe', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Diagrama de Implantação', 'Alguns sistemas são grandes e críticos, logo, e necessário a divisão do processamento em mais de um servidor. O diagrama de Implementação é o diagrama que explica como está organizado a parte física desses sistemas, ou seja, toda a divisão entre os servidores do ambiente, chamados de “Nós”. ', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Eventos', 'São situações ou condições que levam o sistema a ter algum tipo de reação ou resposta, sendo que ele é dividido em dois: eventos externos e eventos internos.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Evento Externo', 'São situações que ocorrem de fora do sistema para dentro do sistema que geram um evento', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Evento Interno', 'São situações que ocorrem dentro do sistema de forma automática que geram um evento.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Estado', 'É um comportamento específico de um objeto do sistema que está ocorrendo por tempo limitado dentro de condições ou eventos.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Diagrama de Estados', 'É um diagrama que representa as mudanças de estados dos objetos e como essas mudanças estão relacionadas.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Transição', 'É a representação da mudança de estado de um objeto, é caracterizado por uma seta entre dois estados diferentes de um mesmo objeto.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Interface', 'É um elemento que define todas as ações ou operações que outros elementos devem possuir.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Componente', 'É uma parte independente de um sistema e tem seu comportamento definido pelas interfaces fornecidas.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Nó ', 'Alguns sistemas são grandes e críticos, logo, e necessário a divisão do processamento em mais de um servidor. Cada um desses servidores do ambiente são chamados de “Nós”.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Atividade ', 'Atividade é o nome de qualquer ação  de uma classe que resulta em alguma alteração no sistema.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Diagrama de Atividades', 'É um diagrama que representa o fluxo de trabalho das atividades de um sistema.', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    array.push(['Diagramas de Visão Geral de Interação', 'É um diagrama muito parecido com “Diagrama de Atividades”, mas neste caso ele também mostra a relação entre outros diagramas de interação, mostrando uma visão geral do sistema', 'https://www.youtube.com/embed/ls5OaixtMT8']);
    return array;
  }

}
