import React, { memo } from 'react'
import { Typography, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Arrow } from 'components/carousel.small'
import { StyledBox as StyledBoxInner } from 'styles/carousel'
import { fontSize } from 'styles/theme'
import { BreakpointsContext } from 'contexts/breakpoints'
import { AccessibilityContext } from 'contexts/accessibility'
import useTextToSpeech from 'hooks/useTextToSpeech'

interface Props {
  total: number
  current: number
  loading: boolean
  clickNextPrev?(page: number): any
}

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiTypography-root': {
    fontWeight: 700,
    margin: theme.spacing(1),
    color: theme.palette.grey[400],
    '&.selected': {
      color: theme.palette.mode == 'dark' ? theme.palette.grey[100] : theme.palette.grey[900],
    },
  },
}))

const Pagination: React.FunctionComponent<Props> = ({
  total,
  current,
  loading,
  clickNextPrev,
}: Props) => {
  const { downLg } = React.useContext(BreakpointsContext)
  const accessibility = React.useContext(AccessibilityContext)
  const { textToSpeech } = useTextToSpeech()
  const handleClick = (isNext: boolean, disabled: boolean) => {
    if (!total || total == 1 || disabled || loading) {
      return
    }
    clickNextPrev(isNext ? current + 1 : current - 1)
  }
  const pages = React.useMemo(() => {
    let arr = []
    const next = current + 1
    if (current > 1) {
      arr.push((current - 1).toString())
    }
    arr.push(current.toString())
    if (current < total) {
      arr.push((current + 1).toString())
    }
    if (next < total) {
      arr.push('...')
    }
    return arr
  }, [current, total])
  return (
    <StyledBox>
      <StyledBoxInner>
        <Arrow
          size={(fontSize + (downLg ? 18 : 22)).toString()}
          className={`prev slick-arrow ${current == 1 ? 'disabled' : ''}`}
          onClick={() => handleClick(false, current == 1)}
        />
        <Box marginX={4} display="flex" alignItems="center">
          {pages.map((v, i) => (
            <Typography
              key={i}
              className={v == current ? 'selected' : ''}
              sx={{
                fontSize: fontSize + accessibility.fontSize,
              }}
              onMouseEnter={(e) => textToSpeech(e, true)}
            >
              {v}
            </Typography>
          ))}
        </Box>
        <Arrow
          size={(fontSize + (downLg ? 18 : 22)).toString()}
          className={`next slick-arrow ${
            current == total ? 'disabled' : total == 1 ? 'disabled' : ''
          }`}
          onClick={() => handleClick(true, current == total)}
        />
      </StyledBoxInner>
    </StyledBox>
  )
}

Pagination.defaultProps = {}

export default memo(Pagination)
