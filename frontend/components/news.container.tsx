import React, { memo } from 'react'
import { useRouter } from 'next/router';
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import NewsItem from 'components/news.item'
import Title from 'components/title'
import CarouselContent from 'components/carousel.content'
import { fontSize } from 'styles/theme'
import { BreakpointsContext } from 'contexts/breakpoints'
import schema from 'types/schemas'

interface Props {
  data: schema['schemas']['Article'][]
}

export const BoxStyled = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3.5),
  borderRadius: theme.spacing(2),
  height: '100%',
  '& .slick-arrow': {
    top: '33%',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 0, 3),
  },
}))

const NewsContainer: React.FunctionComponent<Props> = ({ data }: Props) => {
  const router = useRouter();
  const { downSm } = React.useContext(BreakpointsContext)
  const handleOnClick = React.useCallback(() => router.push('/id/berita', '/id/berita'), []);
  return (
    <BoxStyled sx={{ backgroundColor: downSm ? 'transparent' : 'grey.A100' }}>
      {!downSm && <Title text="Terbaru" paddingY={0} buttonText="lihat semua" onClick={handleOnClick} />}
      {data.length > 0 && (
        <Box marginTop={2}>
          <NewsItem
            data={data[0]}
            gridImage={6}
            gridContent={6}
            gridSpacing={2}
            fontSizeTitle={fontSize + (downSm ? 0 : 8)}
            route="berita"
          />
        </Box>
      )}
      <Box marginTop={downSm ? 3 : 2}>
        <CarouselContent
          data={data.slice(1)}
          slidesToShow={downSm ? 1 : 3}
          withDescription={false}
          route="berita"
        />
      </Box>
    </BoxStyled>
  )
}

NewsContainer.defaultProps = {}

export default memo(NewsContainer)
