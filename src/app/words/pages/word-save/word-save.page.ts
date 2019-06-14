import { ActivatedRoute } from '@angular/router';
import { WordsService } from './../../services/words.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-word-save',
  templateUrl: './word-save.page.html',
  styleUrls: ['./word-save.page.scss'],
})
export class WordSavePage implements OnInit {

  wordForm: FormGroup;
  pageTitle = '...';
  wordID: string = undefined;
  action: string;

  constructor(
    private fb: FormBuilder,
    private wordsService: WordsService,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.createForm();
    this.init();
  }

  init(): void {
    const wordID = this.route.snapshot.paramMap.get('id');
    if (!wordID) {
      this.pageTitle = 'Adicionar Termo';
      return;
    }
    this.wordID = wordID;
    this.pageTitle = 'Editar Termo';
    this.wordsService
    .get(this.wordID)
    .pipe(take(1))
    .subscribe(({ title, link, description }) => {
      this.wordForm.get('title').setValue(title);
      this.wordForm.get('link').setValue(link);
      this.wordForm.get('description').setValue(description);
    });
  }

  private createForm(): void {
    this.wordForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      link: ['', [Validators.required]],
      description: ['', [Validators.required]],
      done: false
    });
  }
  
  async onSubmit(): Promise<void> {
    !this.wordID
    ? this.action = 'Criando'
    : this.action = 'Alterando';
    const loading = await this.overlayService.loading({
      message: this.action + ' novo Termo...'
    });
    try {
      if (!this.wordID) {
        const word = await this.wordsService.create(this.wordForm.value);
        this.action = 'criado';
      } else {
        const word = await this.wordsService.update({
          id: this.wordID,
          ...this.wordForm.value
        });
        this.action = 'alterado';
      }
      this.overlayService.toast({
        message: 'Termo "' + this.wordForm.value.title + '" ' + this.action + ' com sucesso',
        duration: 90000
      });
      this.navCtrl.navigateBack('/tabs/home');
    } catch (error) {
      this.overlayService.toast({
        message: error.message,
        duration: 90000
      });
    } finally {
      loading.dismiss();
    }
  }

}
