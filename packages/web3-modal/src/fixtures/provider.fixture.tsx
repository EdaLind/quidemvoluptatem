import { ButtonVariations, ColumnCenter, PstlButton } from '@past3lle/components'
import { ThemeProvider, createCustomTheme } from '@past3lle/theme'
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import React, { ReactNode, useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import { useAccount } from 'wagmi'

import { useConnection, usePstlWeb3Modal } from '../hooks'
import { PstlW3Providers } from '../providers'
import { WEB3AUTH_TEST_ID, commonProps, pstlModalTheme } from './config'

interface Web3ButtonProps {
  children?: ReactNode
}
const Web3Button = ({ children = <div>Show PSTL Wallet Modal</div> }: Web3ButtonProps) => {
  const [, , { address, currentConnector: connector }] = useConnection()
  const { open } = usePstlWeb3Modal()

  const [provider, setProvider] = useState()

  useEffect(() => {
    connector?.getSigner().then(setProvider)
  }, [connector])

  return (
    <ColumnCenter>
      <PstlButton
        buttonVariant={ButtonVariations.PRIMARY}
        onClick={() => open({ route: address ? 'Account' : 'ConnectWallet' })}
      >
        {children}
      </PstlButton>
      <h3>Connected to {address || 'DISCONNECTED!'}</h3>
      <h3>Connector: {connector?.id}</h3>
      <h3>Provider: {JSON.stringify(provider, null, 2)}</h3>
    </ColumnCenter>
  )
}

const TORUS_LOGO = 'https://web3auth.io/docs/contents/logo-ethereum.png'
const LOGO = 'https://raw.githubusercontent.com/PAST3LLE/monorepo/main/apps/skillforge-ui/public/512_logo.png'

function DefaultApp() {
  const topLevelTheme = useTheme()

  if (!topLevelTheme) console.debug('No top level theme DefaultApp')

  return <InnerApp />
}

function InnerApp() {
  const { setMode, mode } = useTheme()
  return (
    <PstlW3Providers
      config={{
        ...commonProps,
        appName: 'COSMOS APP',
        chains: commonProps.chains,
        wagmiClient: {
          options: {
            pollingInterval: 10_000,
            autoConnect: true
          }
        },
        modals: {
          w3m: commonProps.modals.w3m,
          w3a: {
            appName: 'COSMOS APP',
            network: 'testnet',
            listingName: 'Email/SMS/Social',
            projectId: commonProps.modals.w3a.projectId,
            appLogoLight: LOGO,
            appLogoDark: LOGO,
            configureAdditionalConnectors() {
              // Add Torus Wallet Plugin (optional)
              const torusPlugin = new TorusWalletConnectorPlugin({
                torusWalletOpts: {
                  buttonPosition: 'bottom-right',
                  apiKey: WEB3AUTH_TEST_ID
                },
                walletInitOptions: {
                  whiteLabel: {
                    theme: { isDark: true, colors: { primary: '#00a8ff' } },
                    logoDark: TORUS_LOGO,
                    logoLight: TORUS_LOGO
                  },
                  useWalletConnect: true,
                  enableLogging: true
                }
              })

              return [torusPlugin]
            }
          },
          pstl: {
            ...commonProps.modals.pstl,
            themeConfig: { theme: pstlModalTheme, mode },
            closeModalOnConnect: false,
            connectorDisplayOverrides: {
              general: {
                infoText: {
                  title: 'What is this?',
                  content: (
                    <strong>
                      This is some helper filler text to describe wtf is going on in this connection modal. It is useful
                      to learn these things while browsing apps as users can get confused when having to exit apps to
                      read info somewhere else that isn't the current screent they are on.
                    </strong>
                  )
                }
              },
              web3auth: {
                isRecommended: true,
                infoText: {
                  title: 'How does this login work?',
                  content: (
                    <strong>
                      Social login is done via Web3Auth - a non-custodial social login protocol (i.e they never actually
                      know, or hold your data) - which facilitates logging into dApps (decentralised apps) via familiar
                      social login choices
                    </strong>
                  )
                }
              },
              walletConnect: {
                infoText: {
                  title: 'What is WalletConnect?',
                  content: (
                    <strong>
                      Web3Modal/WalletConnect is a simple blockchain wallet aggregator modal that facilitates the choice
                      of selecting preferred blockchain wallet(s) for connecting to dApps (decentralised apps). This
                      generally requires more blockchain knowledge.
                    </strong>
                  )
                }
              }
            },
            loaderProps: {
              spinnerProps: {
                size: 80
              }
            }
          }
        }
      }}
    >
      <AppWithWagmiAccess />
      <h1>MODE: {mode}</h1>
      <button onClick={() => setMode(mode === 'LIGHT' ? 'DARK' : 'LIGHT')}>Change theme mode</button>
      <button onClick={() => setMode('DEFAULT')}>Revert to default</button>
      <Web3Button />
    </PstlW3Providers>
  )
}

function AppWithWagmiAccess() {
  const accountApi = useAccount()
  console.debug('Account API', accountApi.connector)

  accountApi.connector?.getProvider().then((res) => console.debug('getProvider', res))
  accountApi.connector?.getSigner().then((res) => console.debug('getSigner', res))
  console.debug('Torus EVM Wallet', accountApi.connector?.options?.web3AuthInstance?.walletAdapters?.['torus-evm'])

  return <h1>Here has wagmi access</h1>
}

const withThemeProvider = (Component: () => JSX.Element | null) => (
  <ThemeProvider
    theme={createCustomTheme({
      modes: {
        LIGHT: {
          header: 'white'
        },
        DARK: {
          header: 'black'
        },
        DEFAULT: {
          header: 'red'
        }
      }
    })}
  >
    <Component />
  </ThemeProvider>
)

export default {
  ConnectedModal: withThemeProvider(() => <DefaultApp />)
}
