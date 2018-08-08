// When UI Extensions SDK is loaded the callback will be executed.
window.contentfulExtension.init(initExtension);

function initExtension(extension) {
  // "extension" is providing an interface documented here:
  // https://github.com/contentful/ui-extensions-sdk/blob/master/docs/ui-extensions-sdk-frontend.md

  // Automatically adjust UI Extension size in the Web App.
  extension.window.updateHeight();
  extension.window.startAutoResizer();

  const inputEl = document.getElementById('extension-input');
  const helpTextEl = [...document.getElementsByTagName('label')].find(
    el => el.htmlFor === 'extension-input'
  );

  //  The field this UI Extension is assigned to.
  const { field: labelField } = extension;

  const { sourceFieldIds } = extension.parameters.instance;
  const sourceFields = sourceFieldIds
    .split(',')
    .map(fieldId =>
      extension.contentType.fields.find(field => field.id === fieldId)
    );
  const sourceFieldNames = sourceFields.map(field => field.name);
  const sourceFieldInstances = sourceFields.map(
    field => extension.entry.fields[field.id]
  );

  const updateDerivedValue = () => {
    const sourceValues = sourceFieldInstances.map(field => field.getValue());
    const labelParts = sourceValues.map((value, i) => {
      const fieldName = sourceFieldNames[i];
      return `${fieldName}: ${value}`;
    });

    labelField.setValue(labelParts.join(', '));
  };

  const changeListeners = sourceFieldInstances.map(field =>
    field.onValueChanged(updateDerivedValue)
  );

  helpTextEl.innerText = `Sourced from: ${sourceFieldNames.join(', ')}`;

  // Callback for changes of the field value.
  const detachValueChangeHandler = labelField.onValueChanged(
    valueChangeHandler
  );

  window.addEventListener('onbeforeunload', unloadHandler);

  // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
  function valueChangeHandler(value) {
    inputEl.value = value || '';
  }

  // Event handler for window unload.
  function unloadHandler() {
    window.removeEventListener('onbeforeunload', unloadHandler);
    changeListeners
      .concat(detachValueChangeHandler)
      .forEach(detachHandler => detachHandler());
  }
}
