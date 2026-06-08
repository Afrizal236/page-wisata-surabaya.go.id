import React, { memo } from 'react'
import { Box, IconButton, Popover } from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterIcon,
  TelegramIcon,
  FacebookIcon,
} from 'react-share'
import ShareIcon from 'public/images/icon/share_2.svg'

interface Props {
  title: string
}

const sizeShare = 20
const heightButton = 30

const BoxStyledShare = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& button': {
    position: 'relative',
    marginLeft: theme.spacing(1.7),
    width: heightButton + 1,
    height: heightButton + 1,
    '&:first-of-type': {
      marginLeft: 0,
    },
  },
}))

const PopperShare: React.FunctionComponent<Props> = ({ title }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
  }, [])
  const handleClose = React.useCallback(() => {
    setAnchorEl(null)
  }, [])
  const open = Boolean(anchorEl)
  const URL = React.useMemo(
    () => (typeof window != 'undefined' ? window.location.href : '#'),
    [title]
  )
  return (
    <Box>
      {anchorEl && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          elevation={2}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              backgroundColor: 'common.white',
              paddingX: 2,
              paddingY: 1,
              overflow: 'hidden',
              marginLeft: 2,
            },
          }}
        >
          <BoxStyledShare>
            <WhatsappShareButton url={URL} title={title}>
              <WhatsappIcon size={heightButton} round />
            </WhatsappShareButton>
            <TelegramShareButton url={URL} title={title}>
              <TelegramIcon size={heightButton} round />
            </TelegramShareButton>
            <TwitterShareButton url={URL} title={title}>
              <TwitterIcon size={heightButton} round />
            </TwitterShareButton>
            <FacebookShareButton url={URL} title={title}>
              <FacebookIcon size={heightButton} round />
            </FacebookShareButton>
          </BoxStyledShare>
        </Popover>
      )}
      <IconButton
        disableRipple
        onClick={handleClick}
        sx={{
          marginLeft: 2,
          padding: 0,
          '& .wrapper-svg': {
            width: sizeShare,
            height: sizeShare,
          },
        }}
      >
        <Box
          className="wrapper-svg"
          sx={(theme) => ({
            '& svg': {
              width: `${sizeShare}px`,
              height: `${sizeShare}px`,
            },
            // Background shape (circle) -> cream (primary.main)
            '& svg circle': {
              fill: theme.palette.primary.main,
              stroke: theme.palette.primary.main,
            },
            // Arrow/foreground -> green (secondary.main)
            '& svg path': {
              fill: theme.palette.secondary.main,
              stroke: theme.palette.secondary.main,
            },
          })}
        >
          <ShareIcon />
        </Box>
      </IconButton>
    </Box>
  )
}

PopperShare.defaultProps = {}

export default memo(PopperShare)
