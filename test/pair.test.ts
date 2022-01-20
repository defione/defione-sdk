import { ChainId, Token, Pair, TokenAmount, WETH, Price } from '../src'

describe('Pair', () => {
  const DONE = new Token(ChainId.TESTNET, '0x2eFb50049C2dB2309934f1Cc48fE1163C5607b77', 18, 'DONE', 'USD Coin')
  const WONE = new Token(ChainId.TESTNET, '0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a', 18, 'WONE', 'WONE Stablecoin')

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new Pair(new TokenAmount(DONE, '100'), new TokenAmount(WETH[ChainId.MAINNET], '100'))).toThrow(
        'CHAIN_IDS'
      )
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(Pair.getAddress(DONE, WONE)).toEqual('0xE51F5733849561f2480C401333E041bdcE8d695d')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new Pair(new TokenAmount(DONE, '100'), new TokenAmount(WONE, '100')).token0).toEqual(WONE)
      expect(new Pair(new TokenAmount(WONE, '100'), new TokenAmount(DONE, '100')).token0).toEqual(WONE)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new Pair(new TokenAmount(DONE, '100'), new TokenAmount(WONE, '100')).token1).toEqual(DONE)
      expect(new Pair(new TokenAmount(WONE, '100'), new TokenAmount(DONE, '100')).token1).toEqual(DONE)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new Pair(new TokenAmount(DONE, '100'), new TokenAmount(WONE, '101')).reserve0).toEqual(
        new TokenAmount(WONE, '101')
      )
      expect(new Pair(new TokenAmount(WONE, '101'), new TokenAmount(DONE, '100')).reserve0).toEqual(
        new TokenAmount(WONE, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new Pair(new TokenAmount(DONE, '100'), new TokenAmount(WONE, '101')).reserve1).toEqual(
        new TokenAmount(DONE, '100')
      )
      expect(new Pair(new TokenAmount(WONE, '101'), new TokenAmount(DONE, '100')).reserve1).toEqual(
        new TokenAmount(DONE, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(DONE, '101'), new TokenAmount(WONE, '100')).token0Price).toEqual(
        new Price(WONE, DONE, '100', '101')
      )
      expect(new Pair(new TokenAmount(WONE, '100'), new TokenAmount(DONE, '101')).token0Price).toEqual(
        new Price(WONE, DONE, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(DONE, '101'), new TokenAmount(WONE, '100')).token1Price).toEqual(
        new Price(DONE, WONE, '101', '100')
      )
      expect(new Pair(new TokenAmount(WONE, '100'), new TokenAmount(DONE, '101')).token1Price).toEqual(
        new Price(DONE, WONE, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(DONE, '101'), new TokenAmount(WONE, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(WONE)).toEqual(pair.token0Price)
      expect(pair.priceOf(DONE)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH[ChainId.TESTNET])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new Pair(new TokenAmount(DONE, '100'), new TokenAmount(WONE, '101')).reserveOf(DONE)).toEqual(
        new TokenAmount(DONE, '100')
      )
      expect(new Pair(new TokenAmount(WONE, '101'), new TokenAmount(DONE, '100')).reserveOf(DONE)).toEqual(
        new TokenAmount(DONE, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(WONE, '101'), new TokenAmount(DONE, '100')).reserveOf(WETH[ChainId.TESTNET])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(DONE, '100'), new TokenAmount(WONE, '100')).chainId).toEqual(ChainId.TESTNET)
      expect(new Pair(new TokenAmount(WONE, '100'), new TokenAmount(DONE, '100')).chainId).toEqual(ChainId.TESTNET)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(DONE, '100'), new TokenAmount(WONE, '100')).involvesToken(DONE)).toEqual(true)
    expect(new Pair(new TokenAmount(DONE, '100'), new TokenAmount(WONE, '100')).involvesToken(WONE)).toEqual(true)
    expect(
      new Pair(new TokenAmount(DONE, '100'), new TokenAmount(WONE, '100')).involvesToken(WETH[ChainId.TESTNET])
    ).toEqual(false)
  })
})
