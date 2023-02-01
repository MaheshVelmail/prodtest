// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
    production: false,
    apiUrl:'https://production-tracker-api-3jtbgg3zaa-uk.a.run.app/api/',
    issuer: 'https://kdrp.oktapreview.com/oauth2/default',
    clientId: '0oa1dl6lql0Yy4Io90h8',
    redirectUri: 'https://production-tracker-ui-3jtbgg3zaa-uk.a.run.app/login/callback'
};

