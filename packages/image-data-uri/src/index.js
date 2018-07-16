// When UI Extensions SDK is loaded the callback will be executed.
window.contentfulExtension.init(initExtension);

function initExtension(extension) {
  // "extension" is providing an interface documented here:
  // https://github.com/contentful/ui-extensions-sdk/blob/master/docs/ui-extensions-sdk-frontend.md

  // Automatically adjust UI Extension size in the Web App.
  extension.window.updateHeight();
  extension.window.startAutoResizer();

  // Handle DOM "onbeforeunload" event.
  window.addEventListener('onbeforeunload', unloadHandler);

  const inputEl = document.getElementById('extension-input');
  const errorEl = document.getElementById('extension-error');

  // TODO: Figure out, why `parameters` is undefined.
  const { field, entry, space, parameters } = extension;
  const { locale } = field;
  // const { imageFieldId, maxWidth, maxHeight } = parameters.instance;
  const imageFieldId = 'desktop';
  const maxWidth = '15';
  const maxHeight = '15';

  const imageField = entry.fields[imageFieldId];

  if (!imageField) {
    clearField();
    showError(
      `The extension could not be initialized because a field with id '${imageFieldId}' does not exist.'` // eslint-disable-line max-len
    );
    return;
  }

  // Callback for changes of the field value.
  const detachValueChangeHandler = field.onValueChanged(valueChangeHandler);

  // Callback for changes of the image field value.
  const detachImageValueChangeHandler = imageField.onValueChanged(
    locale,
    imageChangeHandler
  );

  // Manually update the data URI if it is missing on page load (e.g. because
  // the last attempt failed).
  const imageValue = imageField.getValue(locale);
  if (imageValue && !field.getValue()) {
    imageChangeHandler(imageValue);
  }

  // Handler for external field value changes (e.g. when multiple authors are
  // working on the same entry).
  function valueChangeHandler(value) {
    inputEl.value = value || '';
  }

  // Handler for changes to the image field value. Get the preview data URI and
  // save it to the field.
  async function imageChangeHandler(value) {
    const imageId = value.sys.id;
    if (!imageId) {
      clearField();
      return;
    }

    const imageAsset = await space.getAsset(imageId);
    const imageUrl = imageAsset.fields.file[locale].url;

    if (!imageUrl) {
      clearField();
      return;
    }
    const previewImageUrl = constructPreviewImageUrl(imageUrl);
    getDataUri(previewImageUrl).then((dataUri, error) => {
      if (error) {
        showError(error);
        return;
      }
      clearError();
      updateField(dataUri);
    });
  }

  // Adds the size query params to the image URL.
  function constructPreviewImageUrl(imageUrl) {
    const FALLBACK_WIDTH = '12';
    const query = [
      {
        key: 'w',
        value: !maxWidth && !maxHeight ? FALLBACK_WIDTH : maxWidth
      },
      {
        key: 'h',
        value: maxHeight
      },
      {
        key: 'fit',
        value: maxWidth && maxHeight && 'fill'
      }
    ];
    const queryString = query
      .filter(({ value }) => !!value)
      .map(({ key, value }) => `${key}=${value}`)
      .join('&');
    return `${imageUrl}?${queryString}`;
  }

  // Get the data URI for an image.
  function getDataUri(url) {
    return new Promise(resolve => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.getContext('2d').drawImage(image, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };

      image.onerror = () => {
        resolve(
          null,
          'The image failed to load. Reload the page to try again.'
        );
      };

      image.crossOrigin = 'Anonymous';

      image.src = url;
    });
  }

  function updateField(value) {
    try {
      field.setValue(value);
      inputEl.value = value;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      const error = e.message ? e.message : 'An error occured';
      showError(error);
    }
  }

  function clearField() {
    try {
      field.removeValue();
      inputEl.value = '';
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      const error = e.message ? e.message : 'An error occured';
      showError(error);
    }
  }

  // Display an error message below the field.
  function showError(error) {
    if (!error || typeof error !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('Image Data URI extension: Error must be a string.');
      return;
    }
    errorEl.innerHTML = error;
  }

  // Remove the error message below the field.
  function clearError() {
    errorEl.innerHTML = '';
  }

  // Event handler for window unload.
  function unloadHandler() {
    window.removeEventListener('onbeforeunload', unloadHandler);
    detachValueChangeHandler();
    detachImageValueChangeHandler();
  }
}
