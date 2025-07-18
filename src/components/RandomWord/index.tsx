import { useUnit } from 'effector-react'
import { Button } from 'primereact/button'
import React, { useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Divider } from 'primereact/divider'
import {
    $maxTries,
    $randomWord,
    $triesCount,
    $value,
    $win,
    setValue,
    reset,
    guessFx,
    $wordLengthConf,
    setWordLengthConf,
} from '../../state/randomWord'
import { useTranslation } from 'react-i18next'
export const RandomWord = () => {
    const randomWord = useUnit($randomWord)
    const triesCount = useUnit($triesCount)
    const maxTries = useUnit($maxTries)
    const win = useUnit($win)
    const value = useUnit($value)
    const wordLengthConf = useUnit($wordLengthConf)
    const refs = [...Array(30)].map(() => useRef(null))
    const { t } = useTranslation()

    const onChange = (
        row: number,
        col: number,
        letter: string,
        moveTo: number
    ) => {
        if (letter.length > 1) {
            letter = letter[1]
        }

        if (!value.letters[row]) {
            value.letters[row] = []
        }

        value.letters[row][col] = { value: letter?.toUpperCase() }
        setValue({ ...value })
        ;(refs[moveTo]?.current as any)?.focus?.()
    }

    return (
        <div className="flex flex-column align-items-center">
            <h2 className="mt-1 text-bluegray-200">{t('guessAword')}</h2>
            <div className="flex align-items-center gap-2">
                <InputNumber
                    value={wordLengthConf}
                    min={3}
                    max={25}
                    allowEmpty={false}
                    showButtons
                    buttonLayout="horizontal"
                    onValueChange={(e) => setWordLengthConf(e.value ?? 3)}
                />{' '}
                {t('letters')}
            </div>
            {randomWord && (
                <div className="w-full">
                    <div>
                        <Divider className="col-8 m-auto mb-2" />
                        <h4 className="pl-2 pr-2 m-auto col-10 text-bluegray-200">
                            {randomWord?.definition}
                        </h4>
                        <Divider className="col-8 m-auto mt-2 mb-2" />
                    </div>
                    <div className="overflow-auto">
                        <table className="w-min m-auto">
                            <tbody>
                                {[
                                    ...Array(
                                        triesCount < maxTries
                                            ? triesCount + 1
                                            : maxTries
                                    ),
                                ].map((v, i) => (
                                    <tr
                                        key={`r-${i}`}
                                        className={`row-${i !== triesCount && i % 2 === 0 ? 'even' : 'odd'}`}
                                    >
                                        {[...Array(randomWord.key.length)].map(
                                            (v, k) => {
                                                const letter =
                                                    value.letters[i]?.[k]
                                                return (
                                                    <td
                                                        className={`p-2 text-center ${i !== triesCount && value.letters[i] && (letter?.valid === 'yes' ? 'elem-ok' : letter?.valid === 'present' ? 'elem-present' : 'elem-none')}`}
                                                        key={`c-${k}`}
                                                    >
                                                        {!win &&
                                                        i === triesCount &&
                                                        triesCount <
                                                            maxTries ? (
                                                            <InputText
                                                                ref={refs[k]}
                                                                className="w-2rem p-1 text-center"
                                                                autoFocus={
                                                                    k === 0
                                                                }
                                                                value={
                                                                    letter?.value ??
                                                                    ''
                                                                }
                                                                onKeyDown={(
                                                                    event
                                                                ) => {
                                                                    if (
                                                                        event.code ===
                                                                            'Backspace' &&
                                                                        !(
                                                                            event.target as any
                                                                        ).value
                                                                    ) {
                                                                        event.preventDefault()
                                                                        onChange(
                                                                            i,
                                                                            k -
                                                                                1,
                                                                            '',
                                                                            k -
                                                                                1
                                                                        )
                                                                    }
                                                                }}
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    onChange(
                                                                        i,
                                                                        k,
                                                                        event
                                                                            .target
                                                                            .value,
                                                                        event
                                                                            .target
                                                                            .value
                                                                            ? k +
                                                                                  1
                                                                            : k -
                                                                                  1
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            value.letters[i]?.[
                                                                k
                                                            ]?.value
                                                        )}
                                                    </td>
                                                )
                                            }
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {!win && triesCount === maxTries && (
                <h3 className="text-red-400">{t('lost')}</h3>
            )}
            {win && (
                <h3 className="text-blue-400">
                    <i className="pi pi-face-smile text-primary mr-3" />
                    {t('youWon')}
                    <i className="pi pi-face-smile text-primary ml-3" />
                </h3>
            )}
            <div className="mt-5 flex align-items-center gap-5">
                {!win && !!randomWord && triesCount < maxTries && (
                    <Button onClick={() => guessFx()}>{t('guess')}</Button>
                )}
                <Button
                    severity={randomWord ? 'danger' : 'info'}
                    onClick={() => reset()}
                >
                    <i className="pi pi-refresh" />
                    {!randomWord && (
                        <span className="ml-2 font-bold">{t('newGame')}</span>
                    )}
                </Button>
            </div>
        </div>
    )
}
