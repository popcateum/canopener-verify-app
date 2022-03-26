<script lang="ts">
  import { onMount } from 'svelte'
  import { ethers } from 'ethers'
  import axios from 'axios'

  const ethereum: any | undefined = (window as any).ethereum
  let provider: any
  let signer: any

  onMount(async () => {
    await signVerify()
  })

  async function addChain() {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x4bd',
          chainName: 'Popcateum',
          nativeCurrency: {
            name: 'Popcat',
            symbol: 'POP',
            decimals: 18,
          },
          rpcUrls: ['https://dataseed.popcateum.org'],
          blockExplorerUrls: ['https://explorer.popcateum.org'],
        },
      ],
    })
  }

  async function requestAccount() {
    await ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function getInfo() {
    provider = new ethers.providers.Web3Provider(ethereum)
    signer = provider.getSigner()
  }

  async function connect() {
    if (ethereum === undefined) {
      alert('There is no Metamask. Please install Metamask.')
      window.close()
      return
    }
    await getInfo()
    await addChain()
    await requestAccount()
  }

  async function discordInfo() {
    const fragment = new URLSearchParams(window.location.hash.slice(1))
    const tokenType = fragment.get('token_type')
    const accessToken = fragment.get('access_token')
    const result: any = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    })
    const res = await result.json()
    return res.id
  }

  async function signature() {
    const signMessage = 'Holder Verify'
    await connect()
    try {
      const signing = await signer.signMessage(signMessage)
      return signing
    } catch (err) {
      if (err.code === 4001) {
        alert('Signature has been cancelled.')
      }
    }
  }

  async function signVerify() {
    const serverURL = 'https://canopener-verify-bot.popcateum.org/verify'
    try {
      const userId = await discordInfo()
      const signingMessage = await signature()
      await axios.post(serverURL, {
        userId: userId,
        sigMsg: signingMessage,
      })
      alert('verify success')
    } catch (error) {
      alert('verify failed')
    }
  }
</script>
