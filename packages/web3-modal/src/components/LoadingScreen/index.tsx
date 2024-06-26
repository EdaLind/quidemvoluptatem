import { ArticleFadeIn, SpinnerCircle } from '@past3lle/components'
import { setCssBackground, urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import React from 'react'
import styled from 'styled-components'

import { ModalTitleText } from '../ConnectionModal/styled'

interface LoadingContainerProps {
  backgroundColor?: string
  backgroundImg?: string
}
const LoadingContainerFadeIn = styled(ArticleFadeIn)<LoadingContainerProps>`
  display: flex;
  flex-flow: column nowrap;
  justify-content: start;
  align-items: center;
  height: 100%;
  width: 100%;

  > img {
    margin-top: 1em;
  }

  background-color: ${({ backgroundColor = 'transparent' }) => backgroundColor};

  ${({ theme, backgroundColor, backgroundImg }) =>
    backgroundImg &&
    setCssBackground(theme, { imageUrls: [urlToSimpleGenericImageSrcSet(backgroundImg)], backgroundColor })}
`

interface SpinnerProps {
  src?: string | undefined
  size?: number | undefined
}

export interface LoadingScreenProps {
  containerProps?: LoadingContainerProps
  spinnerProps?: SpinnerProps
}

export function LoadingScreen({ containerProps, spinnerProps }: LoadingScreenProps) {
  return (
    <LoadingContainerFadeIn {...containerProps}>
      <ModalTitleText
        fontSize="1.5em"
        marginTop="2em"
        fvs={{
          wght: 100
        }}
      >
        ATTEMPTING LOG IN...
      </ModalTitleText>
      <SpinnerCircle {...spinnerProps} />
    </LoadingContainerFadeIn>
  )
}
