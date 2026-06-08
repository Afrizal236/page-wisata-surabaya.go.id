import React, { memo } from 'react'
import { Button } from '@mui/material'
import Link from 'next/link'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { fontSize, yellowColor } from 'styles/theme'
import { AccessibilityContext } from 'contexts/accessibility'
import useTextToSpeech from 'hooks/useTextToSpeech'

interface Props {
  title: string
  url?: string
  icon?: string
  index: number
  isSelected?: boolean
  withChevron?: boolean
  onClick?: (i: number) => any
}

// function checkIcon(name: string) {
//   const filename = name.replace(/\.[^/.]+$/, '');
//   const check = availableIcon.includes(filename);
//   return check;
// };

const HeaderButton: React.FunctionComponent<Props> = ({
  title,
  url,
  icon,
  index,
  isSelected,
  withChevron,
  onClick,
}: Props) => {
  const { textToSpeech } = useTextToSpeech()
  // const isIcon = React.useMemo(() => checkIcon(icon), [icon]);
  const [isCorrupted, setIsCorrupted] = React.useState(false)
  const accessibility = React.useContext(AccessibilityContext)
  return (
    <Button
      variant="contained"
      disableElevation
      component={Link}
      href={url ? url : '#'}
      className={isSelected ? 'active' : ''}
      onClick={() => (onClick ? onClick(index) : null)}
      startIcon={
        isCorrupted ? null : (
          <img
            src={`https://surabaya.go.id/uploads/images/surabaya/${icon}`}
            height={fontSize + 10}
            onError={() => setIsCorrupted(true)}
          />
        )
      }
      endIcon={withChevron ? <ChevronRightIcon /> : null}
      sx={
        accessibility.css.negative
          ? {
            color: `rgba(255, 255, 255, 0.3) !important`,
            backgroundColor: `rgba(255, 255, 255, 0.1) !important`,
            '&.active': {
              color: `${yellowColor} !important`,
            },
          }
          : null
      }
    >
      <span onMouseEnter={(e) => textToSpeech(e, true)}>{title}</span>
    </Button>
  )
}

HeaderButton.defaultProps = {
  withChevron: true,
  isSelected: false,
}

export default memo(HeaderButton)
