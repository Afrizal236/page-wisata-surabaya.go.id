import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { Box, PaletteMode } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import getDesign from 'styles/theme'
import createEmotionCache from 'styles/createEmotionCache'
import Accessibility from 'components/accessibility'
import { BreakpointsContext } from 'contexts/breakpoints'
import { ColorModeContext } from 'contexts/colorMode'
import { AccessibilityContext } from 'contexts/accessibility'
import useAccessibility from 'hooks/useAccessibility'
import useMediaQuery from '@mui/material/useMediaQuery'

const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function AppIndex(props: MyAppProps) {
  const [queryClient] = React.useState(() => new QueryClient())
  const [mode, setMode] = React.useState<PaletteMode>('light')
  const accessibility = useAccessibility()
  const theme = createTheme(getDesign(mode, accessibility.css.negative))
  const down400 = useMediaQuery(theme.breakpoints.down(theme.breakpoints.values.sm - 200))
  const downSm = useMediaQuery(theme.breakpoints.down('sm'))
  const downMd = useMediaQuery(theme.breakpoints.down('md'))
  const downLg = useMediaQuery(theme.breakpoints.down('lg'))
  const downXl = useMediaQuery(theme.breakpoints.down('xl'))
  const setColorMode = React.useCallback(
    (value?: PaletteMode) => {
      const change: PaletteMode = mode == 'light' ? 'dark' : 'light'
      setMode(value ? value : change)
    },
    [mode]
  )
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Pemerintah Kota Surabaya</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <AccessibilityContext.Provider value={accessibility}>
            <ColorModeContext.Provider value={{ mode, setColorMode }}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <BreakpointsContext.Provider value={{ down400, downSm, downMd, downLg, downXl }}>
                  <Accessibility />
                  <Box
                    display="flex"
                    flexDirection="column"
                    minHeight="100vh"
                    sx={{
                      backgroundColor: theme.palette.common.white,
                      filter: `grayscale(${accessibility.css.grayscale ? '100%' : '0'})`,
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <Component {...pageProps} />
                  </Box>
                </BreakpointsContext.Provider>
              </ThemeProvider>
            </ColorModeContext.Provider>
          </AccessibilityContext.Provider>
        </Hydrate>
      </QueryClientProvider>
    </CacheProvider>
  )
}
