# RUIAN DATA PROCESSOR

This is a small tool to generate cadastral data in JSON format. Uses [RUIAN VDP (Veřejný dálkový přístup)](https://vdp.cuzk.cz/) to download zipped XML file and extracts `State`, `Region`, `Districts`, `Mop`.

## 🏃‍♂️ How to run

```bash
$ yarn
$ yarn start
```

## 📦 Artifacts

Artifacts should be generated to `/artifacts` folder. Should consist:

- zipped XML file
- unzipped XML file
- output JSON with transformed data
