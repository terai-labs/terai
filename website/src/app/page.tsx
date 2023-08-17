import { styled } from '../../styled-system/jsx'

export default function Home() {
  return (
    <styled.main
      w={'100dvw'}
      h={'100dvh'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      flexDirection={'column'}
    >
      <styled.span
        letterSpacing={'-0.06em'}
        fontWeight={'bold'}
        fontSize={'50px'}
        color={'text.primary'}
      >
        Rosetta
      </styled.span>
      <styled.span
        lineHeight={'1'}
        letterSpacing={'-0.06em'}
        fontWeight={'bolder'}
        fontSize={'80px'}
        color={'text.title'}
      >
        Localize for developers
      </styled.span>
      <styled.span
        mt={'lg'}
        maxWidth={'900px'}
        textAlign={'center'}
        fontSize={'lg'}
      >
        Rosetta is a cutting-edge utility that pempower developers and
        streamline the localization workflow. Say goodbye to cumbersome
        localization challenges and hello to a seamless, intuitive solution.
      </styled.span>

      <styled.span color={'text.primary'}>COMING SOON</styled.span>
    </styled.main>
  )
}
