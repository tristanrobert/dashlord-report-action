# dashlord-report-action

This action build a web report based on dashlord-scanners content

## Inputs

### `public-url`

`PUBLIC_URL` for the build. defaults to your repository name.

see https://create-react-app.dev/docs/using-the-public-folder/#adding-assets-outside-of-the-module-system

## Outputs

### `report-path`

Where is the build

## Example usage

```yml
name: Build DashLord report
on:
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - id: dashlord-report
        uses: SocialGouv/dashlord-report-action@master

      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@4.1.0
        with:
          branch: gh-pages
          folder: ${{ steps.dashlord-report.outputs.report-path }}
```
