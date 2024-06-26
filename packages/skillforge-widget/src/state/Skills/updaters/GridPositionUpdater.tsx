import { useForgeMetadataReadAtom, useForgeWindowSizeAtom, useSupportedChainId } from '@past3lle/forge-web3'
import { MEDIA_WIDTHS } from '@past3lle/theme'
import { useEffect, useMemo } from 'react'

import { SkillVectorsMap, useActiveSkillReadAtom, useVectorsAtom } from '..'
import { calculateGridPoints } from '../../../components/Canvas/canvasApi/api/hooks'
import {
  CANVAS_CONTAINER_ID,
  EMPTY_COLLECTION_ROWS_SIZE,
  MINIMUM_BOARD_HEIGHT,
  MINIMUM_BOARD_WIDTH,
  MINIMUM_COLLECTION_BOARD_SIZE
} from '../../../constants/skills'

export function GridPositionUpdater() {
  const chainId = useSupportedChainId()
  const [metadata] = useForgeMetadataReadAtom(chainId)
  const [active] = useActiveSkillReadAtom()
  const [, setVectorsState] = useVectorsAtom()
  const [windowSizeState] = useForgeWindowSizeAtom()

  const gridConstants = useMemo(() => {
    const container = document.getElementById(CANVAS_CONTAINER_ID)

    if (!container) return null

    const highestRowCount = !metadata?.[0]?.length
      ? EMPTY_COLLECTION_ROWS_SIZE
      : metadata.length === 1
      ? metadata[0]?.length
      : metadata.slice().sort((a, b) => (b?.length || 0) - (a?.length || 0))[0].length
    const columns = Math.max(MINIMUM_COLLECTION_BOARD_SIZE, metadata.length)
    const rows = highestRowCount

    const gridHeight = Math.max(container.clientHeight - 30, MINIMUM_BOARD_HEIGHT)
    const gridWidth = Math.max(container.clientWidth, MINIMUM_BOARD_WIDTH) * 0.95

    // config
    const rowHeight = Math.floor(gridHeight / rows)
    const columnWidth = Math.floor(gridWidth / columns)

    return { rows, columns, rowHeight, columnWidth, gridHeight, gridWidth }
    // NOTE: TS complains about windowSizeState which we need to re-calc on window size change(s)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata, windowSizeState.height, windowSizeState.width])

  useEffect(() => {
    if (gridConstants) {
      const vectors = calculateGridPoints(metadata, gridConstants)
      setVectorsState((vectorsState) => ({
        ...vectorsState,
        vectors
      }))

      if (vectors.length > 0) {
        const vectorsMap = vectors.reduce((acc, next) => {
          const id = next.skillId
          if (id) {
            acc[id] = next
          }
          return acc
        }, {} as SkillVectorsMap)
        setVectorsState((state) => ({ ...state, vectorsMap }))
      }
    }
  }, [windowSizeState.height, windowSizeState.width, active, metadata, gridConstants, setVectorsState])

  return null
}

export function calculateCanvasWidth(width: number) {
  if (width <= MEDIA_WIDTHS.upToSmall) {
    return MEDIA_WIDTHS.upToExtraSmall
  } else {
    return width
  }
}
