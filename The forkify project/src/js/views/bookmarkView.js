import View from './View.js';
import previewView from './PreviewView.js';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks');
  _errorMessage = 'No recipes found for you ! Find a recipe and bookmark it.';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarkView();
