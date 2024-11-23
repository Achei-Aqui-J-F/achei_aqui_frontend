import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import IMask from 'imask';

@Directive({
  selector: '[cepImask]'  // Você pode usar qualquer nome de seletor
})
export class ImaskCEPDirective {
  private maskInstance: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // A máscara que você deseja aplicar (no caso do CEP)
    const maskOptions = {
      mask: '00000-000'
    };

    // Aplica a máscara ao elemento
    this.maskInstance = IMask(this.el.nativeElement, maskOptions);
  }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    // Atualiza a máscara conforme o input do usuário
    this.maskInstance.updateValue();
  }
}
