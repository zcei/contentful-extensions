# Derived entry label from fields

This extension provides an entry field for the Contentful UI derived by other entry values. Works with `Symbol` field types.

```sh
yarn cf:create --space-id $SPACE_ID --environment-id master
```

While developing you can run above command once to load the extension from your local machine. 
*Don't forget to reset once you're done testing.*

```sh
contentful extension update --space-id $SPACE_ID --force \
  --src http://localhost:1234/
```
