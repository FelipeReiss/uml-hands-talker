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
  ) {}

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    this.authService.authState$.subscribe(async user => {
      this.authService.setUserFire(user);
      if (user) {
        this.userLogado = true;
        this.authService.updateUserFireClass(this.userService);
        await this.timeOut(1000).then(
          () => (this.userAdmin = this.authService.getUserFireClass().admin)
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

              this.userService.searchArray('/users', 'favoritesWords', word.id).subscribe(valor => {
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
                message: `Não foi possivel deletar termo "${
                  word.title
                }". Favor encaminhar feedback com o erro abaixo: \n${error.message}`,
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
    this.authService.isAuthenticated.pipe(take(1)).subscribe(isAuth => {
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
    await this.timeOut(500).then(() => {
      this.searchForm.get('searchTerm').setValue('');
      this.authService.isAuthenticated.pipe(take(1)).subscribe(isAuth => {
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
    this.userService
      .get(userLocal.id)
      .pipe(take(1))
      .subscribe(valor => {
        const userFormat = valor as UserFirestoreClass;
        if (index < 0) {
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
      await this.timeOut(15000);
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
    array.push([
      'Ator',
      'É algo ou alguém que representa alguma ação que ocorre no sistema, como por exemplo uma pessoa usando o aplicativo ou outro sistema utilizando alguma função disponível.',
      'https://www.youtube.com/embed/DvHp45HjzD4'
    ]);
    array.push([
      'Papel',
      'É aquilo que o Ator representa dentro do sistema, buscando apresentar uma situação ou condição real. Por exemplo, uma pessoa utilizando o software pode representar mais de um papel.',
      'https://www.youtube.com/embed/hq8vpMILUhY'
    ]);
    array.push([
      'Caso de Uso',
      'É uma situação que ocorre no sistema representando a interação entre um Ator e o sistema.',
      'https://www.youtube.com/embed/oRCAAg1MZt4'
    ]);
    array.push([
      'Cenário',
      'É uma situação que leva a uma sequência de funcionamento do sistema. É possível um mesmo caso de uso estar em diferentes cenários e possuir diferentes formas de funcionamento. Por exemplo, no caso de uso “Fazer Pedido”, o ator Funcionário precisa da autorização do gerente. Porém o ator gerente pode fazer o pedido sem precisar de autorizações.',
      'https://www.youtube.com/embed/3tr4rkf-YSE'
    ]);
    array.push([
      'Diagrama de Caso de Uso',
      'É um diagrama que explica um conjunto de “Caso de Uso” e a relação de cada um com um determinado ator ou atores do sistema, ou seja, descreve cada situação que ocorre no sistema bem como os atores envolvidos.',
      'https://www.youtube.com/embed/d3vIL86XkpA'
    ]);
    array.push([
      'Classe',
      'É a representação do manual para chegar há algo real e concreto dentro do universo do sistema, por exemplo, a classe “cachorro” teria suas características, propriedades e ações sendo: cor do pelo, temperamento e latidos.',
      'https://www.youtube.com/embed/UEEpy4H1t4'
    ]);
    array.push([
      'Diagrama de Classes',
      'É um diagrama que explica todos os tipos de classes existentes em um sistema, ou seja, descreve como cada classe é, qual seu tipo, quais são suas características, propriedades e operações. Além disso também explica como as classes se relacionam',
      'https://www.youtube.com/embed/ZwEo6fIVqQA'
    ]);
    array.push([
      'Objeto',
      'É a representação de algo real e concreto dentro do universo do sistema, ou seja, se existe uma classe cachorro, o objeto será o cachorro em si. Em outras palavras, é quando uma classe é transformada em um objeto.',
      'https://www.youtube.com/embed/GFap9dSws9c'
    ]);
    array.push([
      'Atributos',
      'É a representação das características de um objeto, por exemplo, um objeto homem os atributos: altura, cor do cabelo, cor da pele e etc.',
      'https://www.youtube.com/embed/DNWdBPxg5s'
    ]);
    array.push([
      'Métodos',
      'É a representação das ações de um objeto, por exemplo, um objeto homem tem seus métodos: falar, correr, pular e etc.',
      'https://www.youtube.com/embed/mYoktI12aRo'
    ]);
    array.push([
      'Encapsular',
      'É quando o acesso a qualquer característica da classe é protegido, ou seja, apenas os métodos da própria classe acessam seus atributos.',
      'https://www.youtube.com/embed/BZtrEn7zlg'
    ]);
    array.push([
      'Diagrama de Objetos',
      'É um diagrama que explica como um grupo de objetos se relacionando em determinado momento do sistema.',
      'https://www.youtube.com/embed/JBUALqet2ys'
    ]);
    array.push([
      'Diagrama de Tempo',
      'É um diagrama que representa a situação do sistema em um determinado tempo, podendo ser apenas a duração de uma mensagem, troca de dados ou uma condição que gera uma mudança no sistema, por exemplo, sem acesso a internet nenhuma mensagem será recebida.',
      'https://www.youtube.com/embed/p8ob3Wl68H8'
    ]);
    array.push([
      'Diagrama de Comunicação ou Colaboração',
      'É um diagrama que representa quais são as mensagens ou dados trocados entre os objetos.',
      'https://www.youtube.com/embed/oCQP jrO4aY'
    ]);
    array.push([
      'Diagrama de Sequência',
      'É o diagrama que explica o passo a passo da sequência de troca de mensagens ou dados entre objetos durante uma situação. Por exemplo, para um objeto homem brincar com o objeto cachorro é necessário a sequência: Chamar o cachorro, cachorro responder o chamado, cachorro ir até o dono e, finalmente, dono brincar com cachorro.',
      'https://www.youtube.com/embed/zzqwYpQml20'
    ]);
    array.push([
      'Classes Associativas',
      'É uma classe que é gerada a partir da relação de outras duas classes. Ela só se faz necessária enquanto existir uma relação entre as principais.',
      'https://www.youtube.com/embed/jnHScqJQKMw'
    ]);
    array.push([
      'Pacote',
      'Quando nós temos um sistema com muitas classes, é necessário a criação de “pacotes” para organizar essas classes.',
      'https://www.youtube.com/embed/LkjNnk3XYCA'
    ]);
    array.push([
      'Diagrama de Pacotes',
      'É um diagrama que explica a relação entre os pacotes do sistema interagindo uns com os outros.',
      'https://www.youtube.com/embed/xELkG1LV55M'
    ]);
    array.push([
      'Herança',
      'Quando diferentes classes possuem características ou propriedades similares é possível agrupar essas semelhanças em uma única classe. Sendo assim, essas outras classes podem absorver essas características em uma relação de herança.',
      'https://www.youtube.com/embed/HyZNII1oLSk'
    ]);
    array.push([
      'Generalização',
      'É o nome dado a representação gráfica da relação de “Herança” em um Diagrama.',
      'https://www.youtube.com/embed/VbcEWXflQXE'
    ]);
    array.push([
      'Associação de Agregação',
      'É quando duas classes são independentes, porém podem trabalhar juntas quando necessário, criando a relação no momento desejado.',
      'https://www.youtube.com/embed/dpc2YL2QuFY'
    ]);
    array.push([
      'Estende ou Extend',
      'É o nome dado a representação gráfica da “Associação de Agregação” em um Diagrama.',
      'https://www.youtube.com/embed/f9L7JMe13JA'
    ]);
    array.push([
      'Associação de Composição',
      'É quando duas classes são dependentes, ou seja,obrigatoriamente ambas tem que trabalhar juntas.',
      'https://www.youtube.com/embed/jPfjqRq0VJM'
    ]);
    array.push([
      'Incluir ou Include',
      'É o nome dado a representação gráfica da “Associação de Composição” em um Diagrama.',
      'https://www.youtube.com/embed/U9o-K97RyyU'
    ]);
    array.push([
      'Associação Reflexiva',
      'É quando os objetos de uma mesma classe interagem entre si.',
      'https://www.youtube.com/embed/b-w4tdj5gps'
    ]);
    array.push([
      'Persistência',
      'É quando os dados do sistema são preservados em alguma forma de armazenamento.',
      'https://www.youtube.com/embed/wMm7frrLb9U'
    ]);
    array.push([
      'Instância de Classe',
      'É quando um objeto é criado a partir de sua classe.',
      'https://www.youtube.com/embed/aPi9b1Mxy4Q'
    ]);
    array.push([
      'Diagrama de Implantação',
      'Alguns sistemas são grandes e críticos, logo, e necessário a divisão do processamento em mais de um servidor (nós). O diagrama de Implementação é o diagrama que explica como está organizado.',
      'https://www.youtube.com/embed/xnScThu0U5w'
    ]);
    array.push([
      'Nó',
      'Nó é o nome dado a cada um dos servidores dentro de um Diagrama de Implantação.',
      'https://www.youtube.com/embed/uEeZZsulsp0'
    ]);
    array.push([
      'Eventos,',
      'São situações ou condições que levam o sistema a ter algum tipo de reação ou resposta. Eventos externos são situações que ocorrem de fora do sistema para dentro do sistema, por exemplo, você abrir o Whatsapp para enviar uma mensagem. Eventos internos são situações que ocorrem dentro do sistema de forma automática, por exemplo, você receber uma notificação do Whatsapp de uma nova mensagem.',
      'https://www.youtube.com/embed/BCXtpyP79zY'
    ]);
    array.push([
      'Estado',
      'É um comportamento específico de um objeto no sistema que está ocorrendo por tempo limitado dentro de determinadas condições.',
      'https://www.youtube.com/embed/-Y-KFD5LtQ'
    ]);
    array.push([
      'Diagrama de Estados',
      'É um diagrama que representa todas as mudanças de estados dos objetos e como estão de relacionando.',
      'https://www.youtube.com/embed/YHUKz0lyFks'
    ]);
    array.push([
      'Transição',
      'É a representação gráfica da mudança de estado de um objeto.',
      'https://www.youtube.com/embed/PuEkf-MNX4s'
    ]);
    array.push([
      'Atividade',
      'É o nome de qualquer ação de uma classe que resulta em alguma alteração no sistema.',
      'https://www.youtube.com/embed/MEX6Wq5MLoA'
    ]);
    array.push([
      'Diagrama de Atividades',
      'É um diagrama que representa o fluxo de trabalho de todas atividades de um sistema.',
      'https://www.youtube.com/embed/ERcYi5BvUSs'
    ]);
    array.push([
      'Interface',
      'É uma segurança que o sistema tem para funcionar corretamente. Quando uma classe ou componente implementam uma interface, são obrigados a possuir todas as características e operações pré definidas pela interface.',
      'https://www.youtube.com/embed/vACErSq5uRg'
    ]);
    array.push([
      'Componente',
      'É uma parte independente do sistema e tem seu comportamento pré definido pelas interfaces.',
      'https://www.youtube.com/embed/g6KucAf0CU8'
    ]);
    array.push([
      'Realização',
      'É quando um elemento como classe, objeto ou componente, tem suas características ou operações pré definidas, por exemplo, por uma interface.',
      'https://www.youtube.com/embed/csKgeSXjALA'
    ]);

    return array;
  }
}
