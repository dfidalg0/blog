export interface ModalControllerOptions {
  open(): void;
  close(): void;
  isOpen(): boolean;
  setDuration(duration: number | null): void;
}

const modalsMap = new WeakMap<HTMLElement, ModalController>();

export class ModalController {
  constructor(
    private element: HTMLElement,
    private options: ModalControllerOptions
  ) {
    modalsMap.set(element, this);
    this.element.dataset.modal = '';
  }

  static findFrom(el: HTMLElement) {
    return Array
      .from(el.querySelectorAll<HTMLElement>('[data-modal]'))
      .flatMap((modal) => ModalController.get(modal) ?? []);
  }

  static get(el: HTMLElement) {
    return modalsMap.get(el);
  }

  isOpen() {
    return this.options.isOpen();
  }

  toggle(duration?: number) {
    if (this.options.isOpen())
      this.close(duration);
    else
      this.open(duration);
  }

  open(duration?: number) {
    this.options.setDuration(duration ?? null);

    this.options.open();
  }

  close(duration?: number) {
    this.options.setDuration(duration ?? null);

    this.options.close();
  }
}

export {};
