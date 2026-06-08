import React, { memo } from 'react'
import { Button, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { fontSize } from 'styles/theme'
import { BoxStyled } from 'components/news.container'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import useTextToSpeech from 'hooks/useTextToSpeech'
import schema from 'types/schemas'

interface Props {
  data: schema['schemas']['Article'][]
}

const BoxStyledButton = styled(Box)(({ theme }) => ({
  '& .MuiButton-root': {
    padding: theme.spacing(1.5, 3),
    marginTop: theme.spacing(1),
    borderRadius: theme.spacing(1.5),
    textAlign: 'left',
    display: 'block',
    lineHeight: 1.3,
    color: theme.palette.text.primary,
    fontWeight: 700,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  },
}))

const NewsContainer2: React.FunctionComponent<Props> = ({ data }: Props) => {
  const { downSm } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  return (
    <BoxStyled
      sx={{
        backgroundColor: 'background.paper',
        overflow: 'hidden',
        '& button:first-of-type': {
          marginTop: downSm ? 3 : 0,
        },
      }}
    >
      {data.map((v, i) => (
        <BoxStyledButton key={i}>
          <Button
            fullWidth
            component={Link}
            href={`/id/berita/${v.id}/${v.slug}`}
            onMouseEnter={(e) => textToSpeech(e, true)}
            sx={{
              fontSize: fontSize - 2 + accessibility.fontSize,
            }}
          >
            {v.title}
          </Button>
        </BoxStyledButton>
      ))}
    </BoxStyled>
  )
}

NewsContainer2.defaultProps = {}

export default memo(NewsContainer2)
