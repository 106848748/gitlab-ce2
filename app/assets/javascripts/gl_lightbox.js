export default class Lightbox {
  constructor(selector) {
    this.selector = selector || 'a.no-attachment-icon img';
    this.modal = null;
    this.modalDialog = null;
    this.link = null;
    this.image = null;
    this.images = null;
    this.buffer = 60;
    this.bsMobile = 576;
    this.maxWidth = 'none';
    this.template = `
      <div class="lb-modal modal fade"
        tabindex="-1"
        role="dialog"
        aria-labelledby="">
      <div class="modal-dialog">
        <a href="" target="_blank" rel="noopener noreferrer">
          <img src="" alt="" />
        </a>
      </div>
    </div>
    `;

    this.initModal();
    this.bindImages();
    this.watchEvents();
  }

  initModal() {
    this.modal = document.createElement('div');
    this.modal.innerHTML = this.template;
    this.modalDialog = this.modal.querySelector('.modal-dialog');
    this.link = this.modal.querySelector('a');
    this.image = this.modal.querySelector('img');
    document.body.appendChild(this.modal);
  }

  bindImages() {
    this.images = document.querySelectorAll(this.selector);
    this.images.forEach((image) => {
      Object.assign(image.dataset, {
        toggle: 'modal',
        target: '.lb-modal',
      });
      image.addEventListener('click', this.clickHandler.bind(this));
    });
  }

  watchEvents() {
    $(document).on('markdown-preview:fetched', this.addPreviewBindings.bind(this));
    $(document).on('ajax:success', '.gfm-form', this.addNoteBinding.bind(this));
  }

  addPreviewBindings(e, $form) {
    if (!$form) return;
    const $img = $form.find(this.selector);
    $img.attr('data-toggle', 'modal');
    $img.attr('data-target', '.lb-modal');
    $img.on('click', this.clickHandler.bind(this));
  }

  addNoteBinding(e, data) {
    const $img = $(`#note_${data.id} ${this.selector}`);
    $img.attr('data-toggle', 'modal');
    $img.attr('data-target', '.lb-modal');
    $img.on('click', this.clickHandler.bind(this));
  }

  clickHandler(e) {
    e.preventDefault();
    this.maxWidth = Math.min(e.target.naturalWidth, window.innerWidth - this.buffer);

    this.maxWidth = window.innerWidth > this.bsMobile
      ? this.maxWidth
      : 'none';

    this.link.setAttribute('href', e.target.src);
    this.image.setAttribute('src', e.target.src);
    this.modalDialog.style.maxWidth = `${this.maxWidth}px`;
  }
}
