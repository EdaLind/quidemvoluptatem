import { CheckCircle, RowStart } from '@past3lle/components'
import React from 'react'
import styled from 'styled-components'

export const Wrapper = styled(RowStart)`
  position: absolute;
  bottom: 0.75em;
  right: 0.75em;

  gap: 0.4em;

  font-size: 0.5em;
`

export function RecommendedLabel() {
  return (
    <Wrapper>
      Recommended <CheckCircle size={10} />
    </Wrapper>
  )
}
