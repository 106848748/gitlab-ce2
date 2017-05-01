/* eslint-disable space-before-function-paren, no-unused-expressions, no-var, object-shorthand, comma-dangle, max-len */
/* global Notes */

require('~/notes');
require('vendor/autosize');
require('~/gl_form');
require('~/lib/utils/text_utility');

(function() {
  window.gon || (window.gon = {});
  window.gl = window.gl || {};
  gl.utils = gl.utils || {};

  describe('Notes', function() {
    var commentsTemplate = 'issues/issue_with_comment.html.raw';
    preloadFixtures(commentsTemplate);

    beforeEach(function () {
      loadFixtures(commentsTemplate);
      gl.utils.disableButtonIfEmptyField = _.noop;
      window.project_uploads_path = 'http://test.host/uploads';
      $('body').data('page', 'projects:issues:show');
    });

    describe('task lists', function() {
      beforeEach(function() {
        $('.js-comment-button').on('click', function(e) {
          e.preventDefault();
        });
        this.notes = new Notes();
      });

      it('modifies the Markdown field', function() {
        $('input[type=checkbox]').attr('checked', true).trigger('change');
        expect($('.js-task-list-field').val()).toBe('- [x] Task List Item');
      });

      it('submits an ajax request on tasklist:changed', function() {
        spyOn(jQuery, 'ajax').and.callFake(function(req) {
          expect(req.type).toBe('PATCH');
          expect(req.url).toBe('http://test.host/frontend-fixtures/issues-project/notes/1');
          return expect(req.data.note).not.toBe(null);
        });
        $('.js-task-list-field').trigger('tasklist:changed');
      });
    });

    describe('comments', function() {
      var textarea = '.js-note-text';

      beforeEach(function() {
        this.notes = new Notes();

        this.autoSizeSpy = spyOnEvent($(textarea), 'autosize:update');
        spyOn(this.notes, 'renderNote').and.stub();

        $(textarea).data('autosave', {
          reset: function() {}
        });

        $('.js-comment-button').on('click', (e) => {
          const $form = $(this);
          e.preventDefault();
          this.notes.addNote($form);
          this.notes.reenableTargetFormSubmitButton(e);
          this.notes.resetMainTargetForm(e);
        });
      });

      it('autosizes after comment submission', function() {
        $(textarea).text('This is an example comment note');
        expect(this.autoSizeSpy).not.toHaveBeenTriggered();

        $('.js-comment-button').click();
        expect(this.autoSizeSpy).toHaveBeenTriggered();
      });
    });

    describe('renderNote', () => {
      let notes;
      let note;
      let $notesList;

      beforeEach(() => {
        note = {
          discussion_html: null,
          valid: true,
          html: '<div></div>',
        };
        $notesList = jasmine.createSpyObj('$notesList', ['find']);

        notes = jasmine.createSpyObj('notes', [
          'refresh',
          'isNewNote',
          'collapseLongCommitList',
          'updateNotesCount',
        ]);
        notes.taskList = jasmine.createSpyObj('tasklist', ['init']);
        notes.note_ids = [];

        spyOn(window, '$').and.returnValue($notesList);
        spyOn(gl.utils, 'localTimeAgo');
        spyOn(Notes, 'animateAppendNote');
        notes.isNewNote.and.returnValue(true);

        Notes.prototype.renderNote.call(notes, note);
      });

      it('should query for the notes list', () => {
        expect(window.$).toHaveBeenCalledWith('ul.main-notes-list');
      });

      it('should call .animateAppendNote', () => {
        expect(Notes.animateAppendNote).toHaveBeenCalledWith(note.html, $notesList);
      });
    });

    describe('renderDiscussionNote', () => {
      let discussionContainer;
      let note;
      let notes;
      let $form;
      let row;

      beforeEach(() => {
        note = {
          html: '<li></li>',
          discussion_html: '<div></div>',
          discussion_id: 1,
          discussion_resolvable: false,
          diff_discussion_html: false,
        };
        $form = jasmine.createSpyObj('$form', ['closest', 'find']);
        row = jasmine.createSpyObj('row', ['prevAll', 'first', 'find']);

        notes = jasmine.createSpyObj('notes', [
          'isNewNote',
          'isParallelView',
          'updateNotesCount',
        ]);
        notes.note_ids = [];

        spyOn(gl.utils, 'localTimeAgo');
        spyOn(Notes, 'animateAppendNote');
        notes.isNewNote.and.returnValue(true);
        notes.isParallelView.and.returnValue(false);
        row.prevAll.and.returnValue(row);
        row.first.and.returnValue(row);
        row.find.and.returnValue(row);
      });

      describe('Discussion root note', () => {
        let $notesList;
        let body;

        beforeEach(() => {
          body = jasmine.createSpyObj('body', ['attr']);
          discussionContainer = { length: 0 };

          spyOn(window, '$').and.returnValues(discussionContainer, body, $notesList);
          $form.closest.and.returnValues(row, $form);
          $form.find.and.returnValues(discussionContainer);
          body.attr.and.returnValue('');

          Notes.prototype.renderDiscussionNote.call(notes, note, $form);
        });

        it('should query for the notes list', () => {
          expect(window.$.calls.argsFor(2)).toEqual(['ul.main-notes-list']);
        });

        it('should call Notes.animateAppendNote', () => {
          expect(Notes.animateAppendNote).toHaveBeenCalledWith(note.discussion_html, $notesList);
        });
      });

      describe('Discussion sub note', () => {
        beforeEach(() => {
          discussionContainer = { length: 1 };

          spyOn(window, '$').and.returnValues(discussionContainer);
          $form.closest.and.returnValues(row);

          Notes.prototype.renderDiscussionNote.call(notes, note, $form);
        });

        it('should query foor the discussion container', () => {
          expect(window.$).toHaveBeenCalledWith(`.notes[data-discussion-id="${note.discussion_id}"]`);
        });

        it('should call Notes.animateAppendNote', () => {
          expect(Notes.animateAppendNote).toHaveBeenCalledWith(note.html, discussionContainer);
        });
      });
    });

    describe('animateAppendNote', () => {
      let noteHTML;
      let $note;
      let $notesList;

      beforeEach(() => {
        noteHTML = '<div></div>';
        $note = jasmine.createSpyObj('$note', ['addClass', 'renderGFM', 'removeClass']);
        $notesList = jasmine.createSpyObj('$notesList', ['append']);

        spyOn(window, '$').and.returnValue($note);
        spyOn(window, 'setTimeout').and.callThrough();
        $note.addClass.and.returnValue($note);
        $note.renderGFM.and.returnValue($note);

        Notes.animateAppendNote(noteHTML, $notesList);
      });

      it('should init the note jquery object', () => {
        expect(window.$).toHaveBeenCalledWith(noteHTML);
      });

      it('should call addClass', () => {
        expect($note.addClass).toHaveBeenCalledWith('fade-in-full');
      });
      it('should call renderGFM', () => {
        expect($note.renderGFM).toHaveBeenCalledWith();
      });

      it('should append note to the notes list', () => {
        expect($notesList.append).toHaveBeenCalledWith($note);
      });
    });

    describe('getFormData', () => {
      it('should return form metadata object from form reference', () => {
        this.notes = new Notes();

        const $form = $('form');
        const sampleComment = 'foobar';
        $form.find('textarea.js-note-text').val(sampleComment);
        const { formData, formContent, formAction } = this.notes.getFormData($form);

        expect(formData.indexOf(sampleComment) > -1).toBe(true);
        expect(formContent).toEqual(sampleComment);
        expect(formAction).toEqual($form.attr('action'));
      });
    });

    describe('createPlaceholderNote', () => {
      it('should return constructed placeholder element based on form contents', () => {
        this.notes = new Notes();
        window.gon.current_username = 'root';
        window.gon.current_user_fullname = 'Administrator';

        const sampleComment = 'foobar';
        const uniqueId = 'b1234-a4567';
        const $tempNote = this.notes.createPlaceholderNote(sampleComment, uniqueId);
        const $tempNoteHeader = $tempNote.find('.note-header');

        expect($tempNote.prop('nodeName')).toEqual('LI');
        expect($tempNote.attr('id')).toEqual(uniqueId);
        $tempNote.find('.timeline-icon > a, .note-header-info > a').each(function() {
          expect($(this).attr('href')).toEqual(`/${window.gon.current_username}`);
        });
        expect($tempNoteHeader.find('.hidden-xs').text().trim()).toEqual(window.gon.current_user_fullname);
        expect($tempNoteHeader.find('.note-headline-light').text().trim()).toEqual(`@${window.gon.current_username}`);
        expect($tempNote.find('.note-body .note-text').text().trim()).toEqual(sampleComment);
      });
    });

    describe('postComment & updateComment', () => {
      const sampleComment = 'foo';
      const updatedComment = 'bar';
      const note = {
        id: 1234,
        html: `<li class="note note-row-1234 timeline-entry" id="note_1234">
                <div class="note-text">${sampleComment}</div>
               </li>`,
        note: sampleComment,
        valid: true
      };
      let $form;
      let $notesContainer;

      beforeEach(() => {
        this.notes = new Notes();
        window.gon.current_username = 'root';
        window.gon.current_user_fullname = 'Administrator';
        $form = $('form');
        $notesContainer = $('ul.main-notes-list');
        $form.find('textarea.js-note-text').val(sampleComment);
        $('.js-comment-button').click();
      });

      it('should show placeholder note while new comment is being posted', () => {
        expect($notesContainer.find('.note.being-posted').length > 0).toEqual(true);
      });

      it('should remove placeholder note when new comment is done posting', () => {
        spyOn($, 'ajax').and.callFake((options) => {
          options.success(note);
          expect($notesContainer.find('.note.being-posted').length).toEqual(0);
        });
      });

      it('should show actual note element when new comment is done posting', () => {
        spyOn($, 'ajax').and.callFake((options) => {
          options.success(note);
          expect($notesContainer.find(`#${note.id}`).length > 0).toEqual(true);
        });
      });

      it('should show flash error message when new comment failed to be posted', () => {
        spyOn($, 'ajax').and.callFake((options) => {
          options.error();
          expect($notesContainer.parent().find('.flash-container .flash-text').is(':visible')).toEqual(true);
        });
      });

      it('should show updated comment as _actively being posted_ while comment being updated', () => {
        spyOn($, 'ajax').and.callFake((options) => {
          options.success(note);
          const $noteEl = $notesContainer.find(`#note_${note.id}`);
          $noteEl.find('.js-note-edit').click();
          $noteEl.find('textarea.js-note-text').val(updatedComment);
          $noteEl.find('.js-comment-save-button').click();
          expect($noteEl.hasClass('.being-posted')).toEqual(true);
          expect($noteEl.find('.note-text').text()).toEqual(updatedComment);
        });
      });

      it('should show updated comment when comment update is done posting', () => {
        spyOn($, 'ajax').and.callFake((options) => {
          options.success(note);
          const $noteEl = $notesContainer.find(`#note_${note.id}`);
          $noteEl.find('.js-note-edit').click();
          $noteEl.find('textarea.js-note-text').val(updatedComment);
          $noteEl.find('.js-comment-save-button').click();

          spyOn($, 'ajax').and.callFake((updateOptions) => {
            const updatedNote = Object.assign({}, note);
            updatedNote.note = updatedComment;
            updatedNote.html = `<li class="note note-row-1234 timeline-entry" id="note_1234">
                                  <div class="note-text">${updatedComment}</div>
                                </li>`;
            updateOptions.success(updatedNote);
            const $updatedNoteEl = $notesContainer.find(`#note_${updatedNote.id}`);
            expect($updatedNoteEl.hasClass('.being-posted')).toEqual(false); // Remove being-posted visuals
            expect($updatedNoteEl.find('note-text').text().trim()).toEqual(updatedComment); // Verify if comment text updated
          });
        });
      });

      it('should show flash error message when comment failed to be updated', () => {
        spyOn($, 'ajax').and.callFake((options) => {
          options.success(note);
          const $noteEl = $notesContainer.find(`#note_${note.id}`);
          $noteEl.find('.js-note-edit').click();
          $noteEl.find('textarea.js-note-text').val(updatedComment);
          $noteEl.find('.js-comment-save-button').click();

          spyOn($, 'ajax').and.callFake((updateOptions) => {
            updateOptions.error();
            const $updatedNoteEl = $notesContainer.find(`#note_${note.id}`);
            expect($updatedNoteEl.hasClass('.being-posted')).toEqual(false); // Remove being-posted visuals
            expect($updatedNoteEl.find('note-text').text().trim()).toEqual(sampleComment); // See if comment reverted back to original
            expect($notesContainer.parent().find('.flash-container .flash-text').is(':visible')).toEqual(true); // Flash error message shown
          });
        });
      });
    });
  });
}).call(window);
