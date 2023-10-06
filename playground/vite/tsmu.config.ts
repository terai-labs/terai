import { defineConfig, createGoogleCloudTranslator } from '@tsmu/dev'

const translator = createGoogleCloudTranslator({
  projectId: 'reword-399419',
  credentials: {
    type: 'service_account',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvOXarRoF8aSPU\nv8I9/EaglTE969UXXZ5Az9yFwDk86uxfPNy1BpGYSB+Md8D7eU+DPpiq2s7bzq2P\neNQ7VzyBGYPuUvTwc7vuWjDb2CUfChwU295RTo6pSSoUWYTm3NOXyMPIQsr1A8/m\nHZMORKhjsiXHvWROFRmniYyx2ohZcDiP1vlwHYXXIEt9fY5pepKLr5yBlfg1Zwik\nx3O9McgHaYqvkALuhd7FApiTzOwIMuTLb/3Wx0Z6cVXAE5UEehh9tkKPNPRFukGq\naCZ6CwNgAIbYyT2Wky0lvgMjG8Prh0PdGIBQQ3Sxna4RDjx8k3QoI45C37pOGoiq\nHJCU7mOxAgMBAAECggEAGViumcfxIxXyYOv8JQtBDCmInfRnNqIMKkPnGlHb9bvl\nxUEAjA8PMH/+UEtiVv4NSmbbnptYIOOcp4xK5uqPjf0q4GaPl9il7qyNNL/nXr4P\nodTMK+a5LDOxKpBocRywXtxjtawzv411nUvZ4c58rS8v19zFjaXvuBRljbSW1Jjx\nwE4otPOXzHaILDYaLa7ykDZQgKPQ3XMobzu5cP6v59XtOREu6YyH7kTfxTNpWLXB\nVGogH+3I0aODW09kUc2nVp69KgB4NKHuXedU/DOZ5wymD3Y4yTlepVlLwqFpCumT\nHXQvPBsafo4GdckNt1MO7ZVmqq1dNcT7xyYulmpVIQKBgQDdUiRzJwRqjUI1SVSr\n/go8RRUSo4hKfdJqlOwelGekHI/BdWBhO8V85TK0itbvBjHqUIxYr1Ytu/t+z+hF\nmaikoXqcL2shcFzwdiwUK52SxxDLH+eg1aPcJP97FpY9E8arF0xlxxKustl2ADkj\n+ErF/80llhVm7Z8dkCg0Zzdr9wKBgQDKrkDdDA95C7HkAoS+BhatJODyPWx6DQVx\ntd/Z5IT8NQJDh5G2Jc3z1mSTLq5N6MCLmJvMof1ISXgUwW6BuIl7hafH1uMKN2La\nY9MAR7bxSC3QImf6hvrFDDIUXWUFwP+ED0SGHOT7viiKDkDNU6fIR8L1huAl7NhF\nZmCnc0CzlwKBgQCUi7SBQXfaWFNO1pgpFEokZ62cI/yvGsIm3SuZ3rutT6pBC5oT\nyP1lNaSRvvpB1eOcxFFemNh7u8cyNzNLu7WQQf28ZKs/912522b8ZsXNJSUlYJWj\nwqDHemGraN6Pwf0/ClUxnqrwbIQ+iinP9a+iM22qw5A71FNOkVoayghNwwKBgDHx\nUFBnyWRFandJ25XLgEj3/moSkqlcjgvgCiHx+ob/NOiY/mHI3QAJw0y1QwQ1p0R+\nvV1mSThHykwrAeT7KP2ECLzoiZeZ4ET6NiMqiLzZ0VgpMj/8hMyLXcfA38TUMuJC\ntNrrQc16pRinvHYb+AsVC8hejNsrintHZ+e7MaVPAoGAXIQO5dj/hS419X9DmQ3r\nvHqwydVJuOBeiMcQXyzMcmbmEQDxsxF+AjP4bUMQnXmuyA52wPuMu34oBYsbxBio\nvQalNUnb8Vv/gKnaUi67V8J7JbFWSTCOKN9KpfkhC0k1JWw/Y6a1fnRp0mWXTAsJ\nBV0THeRIOehP2VFK22ig5BM=\n-----END PRIVATE KEY-----\n',
    client_email: 'reword@reword-399419.iam.gserviceaccount.com',
    client_id: '117675259755474601860'
  }
})

export default defineConfig({
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  projectLocale: 'en',
  outDir: './src/locale',
  locales: ['es', 'it'],
  translator
})
