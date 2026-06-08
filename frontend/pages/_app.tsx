import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { Box, PaletteMode } from '@mui/material'
import _ from 'lodash'
import { setCookies, getCookie } from 'cookies-next'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import getDesign from 'styles/theme'
import createEmotionCache from 'styles/createEmotionCache'
import Header from 'components/header'
import Footer from 'components/footer'
import Accessibility from 'components/accessibility'
import { heightHeader } from 'styles/theme'
import { BreakpointsContext } from 'contexts/breakpoints'
import { ColorModeContext } from 'contexts/colorMode'
import { AccessibilityContext } from 'contexts/accessibility'
import useAccessibility from 'hooks/useAccessibility'
import useMediaQuery from '@mui/material/useMediaQuery'

const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const customCssNegative = 'body > * {color: #fdd300 !important}'
const customCssUnderline = 'body a {text-decoration: underline !important}'

export default function MyApp(props: MyAppProps) {
  // const router = useRouter();
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false },
        },
      })
  )
  const [mode, setMode] = React.useState<PaletteMode>('light')
  // const [ pageLoading, setPageLoading ] = React.useState(false);
  const accessibility = useAccessibility()
  const [load, setLoad] = React.useState(true)

  const theme = createTheme(getDesign(mode, accessibility.css.negative))

  // Accessibility: toggle body classes for underline, grayscale, negative
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('underline', accessibility.css.underline)
      document.body.classList.toggle('grayscale', accessibility.css.grayscale)
      document.body.classList.toggle('negative', accessibility.css.negative)
    }
  }, [accessibility.css.underline, accessibility.css.grayscale, accessibility.css.negative])
  const down400 = useMediaQuery(theme.breakpoints.down(theme.breakpoints.values.sm - 200))
  const downSm = useMediaQuery(theme.breakpoints.down('sm'))
  const downMd = useMediaQuery(theme.breakpoints.down('md'))
  const downLg = useMediaQuery(theme.breakpoints.down('lg'))
  const downXl = useMediaQuery(theme.breakpoints.down('xl'))
  const setColorMode = React.useCallback(
    (value?: PaletteMode) => {
      const change: PaletteMode = mode == 'light' ? 'dark' : 'light'
      setMode(value ? value : change)
      setCookies('theme', value ? value : change)
      if (change == 'light' && accessibility.css.negative)
        accessibility.setCss({ ...accessibility.css, negative: false })
    },
    [mode, accessibility.css]
  )
  React.useEffect(() => {
    const timer1 = setTimeout(() => setLoad(false), 2000)
    const themeCookie: any = getCookie('theme')
    setMode(themeCookie ? themeCookie : 'light')
    return () => {
      clearTimeout(timer1)
      setLoad(false)
    }
  }, [])
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Pemerintah Kota Surabaya</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        {accessibility.css.negative && <style>{customCssNegative}</style>}
        {accessibility.css.underline && <style>{customCssUnderline}</style>}
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <AccessibilityContext.Provider
            value={{
              fontSize: accessibility.fontSize,
              setFontSize: accessibility.setFontSize,
              css: accessibility.css,
              setCss: accessibility.setCss,
              speech: accessibility.speech,
              setSpeech: accessibility.setSpeech,
            }}
          >
            <ColorModeContext.Provider
              value={{
                mode,
                setColorMode,
              }}
            >
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <BreakpointsContext.Provider
                  value={{
                    down400,
                    downSm,
                    downMd,
                    downLg,
                    downXl,
                  }}
                >
                  {/* <Loading load={load} /> */}
                  {!load && <Header opacity={load ? 0 : 1} />}
                  <Accessibility />
                  <Box
                     display={load ? 'none' : 'flex'}
                    flexDirection="column"
                    minHeight={load ? 0 : '100vh'}
                    paddingTop={`${downSm ? 70 : heightHeader}px`}
                    overflow={load ? 'hidden' : 'visible'}
                    height={load ? 0 : 'auto'}
                    sx={{
                      backgroundColor:
                        mode == 'dark'
                          ? theme.palette.background.paper
                          : theme.palette.common.white,
                      opacity: load ? 0 : 1,
                      filter: `grayscale(${accessibility.css.grayscale ? '100%' : '0'})`,
                      // margin: 0,
                      // padding: 0,
                    }}
                  >
                    <Component {...pageProps} />
                  </Box>
                  {!load && <Footer load={load} />}
                </BreakpointsContext.Provider>
              </ThemeProvider>
            </ColorModeContext.Provider>
          </AccessibilityContext.Provider>
          <ReactQueryDevtools initialIsOpen={false} />
        </Hydrate>
      </QueryClientProvider>
    </CacheProvider>
  )
}
