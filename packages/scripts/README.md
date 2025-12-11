# OTP-UI React Component Library - scripts package

Various utility scripts for the OTP-UI React component library and implementers.

## Internationalization

### Validating i18n usage

Use `run-validate-i18n.js` to check that:

- All entries in the given translation YML files are used in the code.
- All message ids used in the given code have translations.

```bash
node path-to/dist/run-validate-i18n.js ../trip-details/src ../trip-details/i18n
node path-to/dist/run-validate-i18n.js ../**/src ../**/i18n
```

### Extracting a CSV file of messages

Use `run-collect-i18n-messages.js` to gather all messages from code and output them in a CSV table,
with message ids, descriptions, and content in the languages specified or found:

```bash
node path-to/dist/run-collect-i18n-messages.js ../**/src ../**/i18n
node path-to-dist/run-collect-i18n-messages.js ../**/src ../**/i18n/en-US.yml
```

### Exceptions

For the scripts to work best, you should use **literal** ids as much as possible with `<FormattedMessage>` or `intl.formatMessage`.
This is because the scripts use the `formatJS` CLI, and the `formatJS` CLI simply ignores message ids that are not literals.

Exceptions to the checks above can be defined when:

- Reusing a message defined in another package,
- A message id needs to be computed, with some portion of it coming from a parameter,
  and implementing a `switch` case does not provide substantial benefits.

Exceptions are defined in optional files named `i18n-exceptions.json`, placed in each folder with
internationalized content YML files where exceptions occur:

```
monorepo
  package1
    src
      component.tsx
    i18n
      en-US.yml
      <other-locales.yml>
      i18n-exceptions.json (optional)
    ...
  package2
    src
      component2.tsx
    i18n
      en-US.yml
      <other-locales.yml>
      i18n-exceptions.json (optional)
    ...
```

The contents of `i18n-exceptions.json` is as follows:

```json
{
  "ignoredIds": [
    "otpUi.TestComponent.unusedTextThatIsIgnored"
    "otpUi.OtherComponent.idFromAnotherPackage"
  ],
  "groups": {
    "otpUi.OtherComponent.*Message": ["key1", "key2"]
  }
}
```

#### Ignored ids

The `ignoredIds` field in `i18n-exceptions.json` contains an array of ignored ids,
typically message ids defined in other packages that your application imports.

Ignored ids are ignored in the checking process and do not appear in the CSV output of
`run-collect-i18n-messages.js`.

#### Message groups

Message groups are defined in the `groups` field of `i18n-exceptions.json`.
Message groups allow the below snippet while also having the corresponding messages printed
in the CSV output of `run-collect-i18n-messages.js`.

```jsx
<FormattedMessage id={`otpUi.Component.messagePrefix${param}Suffix`} />
```

instead of

```jsx
switch (param) {
  case "SomeValue":
    return <FormattedMessage id="otpUi.Component.messagePrefixSomeValueSuffix" />
  case "OtherValue":
    return <FormattedMessage id="otpUi.Component.messagePrefixOtherValueSuffix" />
  ...
}
```

Each entry in the group comprises of a field name (or "template" for the message ids) and a list of applicable values.
A single asterisk denotes where the values in the message id template will be inserted:

```
  "otpUi.Component.messagePrefix*Suffix": ["SomeValue", "OtherValue", "MiscValue"]
```

The example above will cover these three message ids:

- `otpUi.Component.messagePrefixSomeValueSuffix`
- `otpUi.Component.messagePrefixOtherValueSuffix`
- `otpUi.Component.messagePrefixMiscValueSuffix`

These messages must appear in the corresponding language files for the checks to pass.
Other similar message ids of that group not included in the list of values for the group will be rejected.
